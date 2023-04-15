import boxen from "boxen";
import Joi from "joi";
import { existsSync } from "fs";
import { ethers } from "ethers";
import { bn_fromWei } from "../utils";
import pTimeout from "p-timeout";
import { chainStateList, SupportChainType } from "../web3";

export class Web3Checker {
    static isAddress(address: string) {
        const regExp = new RegExp(/^0x[a-fA-F0-9]{40}$/)
        return regExp.test(address)
    }

    static isTxHash(hash: string) {
        const regExp = new RegExp(/^0x[a-fA-F0-9]{64}$/)
        return regExp.test(hash)
    }

    static isPrivateKey(privateKey: string) {
        const regExp = new RegExp(/^(0x)?[a-fA-F0-9]{64}$/)
        return regExp.test(privateKey)
    }

    static isMnemonic(mnemonic: string) {
        const regExp = new RegExp(/^(?:\b[a-z]{3,}\b\s+){11,}(?:\b[a-z]{3,}\b)?$/)
        return regExp.test(mnemonic)
    }
}

type messageType = 'Success' | 'Warning' | 'Error'
// type web3RuleType = 'Address' | 'PrivateKey' | 'Mnemonic'

export class ProjectChecker extends Web3Checker {
    readonly title: string
    private errorMessages: string[] = [`❌ Parameter configuration detection failed\n`]
    private warningMessages: string[] = [`🐝 Parameter configuration detection warning\n`]
    private successMessages: string[] = [`✅ Operation parameter configuration detection passed\n`]

    private result: any = {}

    constructor(title: string = '') {
        super()
        this.title = title
    }

    private wrapMessage(message: string | string[]) {
        const messages = typeof message === 'string' ? [message] : message
        const regExp = /^(- )(.+)/gi
        const list = messages.map(message => {
            return regExp.test(message) ? message : `- ${message}`
        })

        return list
    }

    pushMessage(type: messageType, message: string | string[]) {
        switch (type) {
            case 'Error':
                this.errorMessages = this.errorMessages.concat(this.wrapMessage(message))
                break;
            case 'Warning':
                this.warningMessages = this.warningMessages.concat(this.wrapMessage(message))
                break;
            case 'Success':
                this.successMessages = this.successMessages.concat(this.wrapMessage(message))
                break;
            default:
                break;
        }
    }

    sayResult(isErrorExit: boolean = true) {
        if (this.errorMessages.length > 1) {
            console.log(boxen(this.errorMessages.join('\n'), {
                padding: 1,
                title: this.title,
                borderColor: 'red'
            }))

            isErrorExit && process.exit()
        } else if (this.warningMessages.length > 1) {
            console.log(boxen(this.warningMessages.join('\n'), {
                padding: 1,
                title: this.title,
                borderColor: 'yellow'
            }))
        } else {
            this.successMessages[0] = this.successMessages.length === 1 ?
                this.successMessages[0].trim() : this.successMessages[0].includes('\n') ?
                    this.successMessages[0] : this.successMessages[0] + '\n';

            console.log(boxen(this.successMessages.join('\n'), {
                padding: 1,
                title: this.title,
                borderColor: 'green'
            }))
        }
    }

    getResult<T>(): T {
        return this.result
    }

    checkFileExist(absolutPath: string) {
        const isExitsAccountsFile = existsSync(absolutPath)
        if (!isExitsAccountsFile) this.pushMessage('Error', `PATH_NOT_EXIST: path does not exist (${absolutPath})`)
        return this
    }

    // 验证配置是否符合规则
    checkValidate(config: any, validateSchema: Joi.ObjectSchema<any>) {
        const { error, value } = validateSchema.validate(config, { abortEarly: false })
        error && error.details.forEach((err: any) => this.pushMessage('Error', `PARAMTER_ERROR: ${err.message}`))
        this.result = { ...value }
        return this
    }

    // 测试节点延迟和实时Gwei
    async testRpcLatency(rpcOrChians: SupportChainType | string | (SupportChainType | string)[]) {
        rpcOrChians = Array.isArray(rpcOrChians) ? rpcOrChians : [rpcOrChians]
        const testRpcTasksPromises = rpcOrChians.map(async (rpcOrChian) => {
            let rpc = Object.keys(chainStateList).includes(rpcOrChian) ? chainStateList[rpcOrChian as SupportChainType].rpcUrls[0] : rpcOrChian
            const provider = new ethers.providers.JsonRpcProvider(rpc)
            const timeout = 5000
            const pattern = /(\S)\/[0-9a-fA-F]+$/;
            const replacement = "$1/<PRIVATE_NODE>";
            const regex = new RegExp(pattern);
            const showRpc = rpc.replace(regex, replacement);

            try {
                const startTime = Date.now()
                const gasPrice = await pTimeout(provider.getGasPrice(), timeout, `time out for ${timeout}ms`)

                const latencyTime = Date.now() - startTime

                this.pushMessage('Success', `Latency: ${latencyTime}ms ( ${showRpc} ) [Gas: ${bn_fromWei(gasPrice, 9, 4)}]`)
            } catch (error: any) {
                if (error instanceof Error) {
                    this.pushMessage('Error', `${error.message}  (${showRpc})`)
                } else {
                    this.pushMessage('Error', `${error.code}: ${error.reason}  (${showRpc})`)
                }
            }
        })

        await Promise.all(testRpcTasksPromises)
    }
}