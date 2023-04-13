import { ethers } from "ethers";
import { existsSync, readFileSync } from "fs";
import xlsx from 'node-xlsx'

class FileModel {
    constructor() { }

    // 按行切分文件为每行数组
    static sliceRowFile(absolutePath: string) {
        if (!existsSync(absolutePath)) return []
        const fileData = readFileSync(absolutePath, 'utf-8')
        return fileData ? fileData.split('\n').map(item => item.trim()).filter(item => item) : []
    }

    static parseFileName(path: string) {
        const targetFileName = path.match(/\/([^\/]+)$/) as RegExpMatchArray
        const [filename, suffix] = targetFileName[1].split('.')

        return { filename, suffix }
    }
}

export class AccountReader extends FileModel {
    private path: string

    constructor(absolutePath: string) {
        super()
        this.path = absolutePath
    }

    protected formatAccountsToSigners = (privateKeysOrAccounts: Record<string, string> | string[], provider?: ethers.providers.Provider) => {
        const signers: ethers.Wallet[] = []

        if (Array.isArray(privateKeysOrAccounts)) {
            // 私钥数组转化为 signers
            privateKeysOrAccounts.forEach(privateKey => {
                signers.push(new ethers.Wallet(privateKey, provider))
            });
        } else {
            // Json 键值对转化为 signers
            for (const address in privateKeysOrAccounts) {
                if (Object.prototype.hasOwnProperty.call(privateKeysOrAccounts, address)) {
                    const privateKey = privateKeysOrAccounts[address];
                    signers.push(new ethers.Wallet(privateKey, provider))
                }
            }
        }

        return signers
    }

    // 解析用户私钥文件
    formatToSigners(provider?: ethers.providers.Provider) {
        const fileAbsolutePath = this.path
        const { suffix } = FileModel.parseFileName(fileAbsolutePath)

        switch (suffix) {
            case 'txt':
                const txtDataArr = FileModel.sliceRowFile(fileAbsolutePath)
                return this.formatAccountsToSigners(txtDataArr, provider)
            case 'xlsx':
                const sheet1Data = xlsx.parse(fileAbsolutePath)[0].data
                sheet1Data.splice(0, 1)

                const privateKeyReg = /^0x[0-9a-fA-F]{64}$/
                const columIndex = (sheet1Data[0] as any[]).findIndex(item => privateKeyReg.test(item))
                const privateKeyRows = sheet1Data.map((item: any) => item[columIndex])
                return this.formatAccountsToSigners(privateKeyRows, provider)
            case 'json':
                const jsonData = require(this.path)
                return this.formatAccountsToSigners(jsonData, provider)
            default:
                return []
        }
    }

    // 随机获取 N 个 Signer
    getRandomSigners(count: number, provider?: ethers.providers.Provider) {
        const signers = this.formatToSigners(provider)
        if (signers.length <= count) return signers
        const randomIndexArr: number[] = []
        while (randomIndexArr.length < count) {
            const randomIndex = Math.floor(Math.random() * signers.length)
            !randomIndexArr.includes(randomIndex) && randomIndexArr.push(randomIndex)
        }
        return randomIndexArr.map(index => signers[index])
    }

    // 随机获取 N 个地址 Signer
    getOneRandomSigner() {
        return (this.getRandomSigners(1))[0]
    }
}