import boxen from "boxen";
import Joi from "joi";
import { existsSync } from "fs";
import { SupportChainType } from "../web3/type";
import { chainState } from "../web3/chainState";
import { ethers } from "ethers";

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

export class ProjectChecker {
    readonly title: string
    readonly errorMessages: string[] = [`❌ Parameter configuration detection failed\n`]
    readonly warningMessages: string[] = [`🐝 Parameter configuration detection warning\n`]
    readonly successMessages: string[] = [`✅ Operation parameter configuration detection passed\n`]

    readonly result: Object = {}

    constructor(title: string = '') {
        this.title = title
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


    checkFileExist(absolutPath: string) {
        const isExitsAccountsFile = existsSync(absolutPath)
        if (!isExitsAccountsFile) this.errorMessages.push(`- PATH_NOT_EXIST: path does not exist (${absolutPath})`)
        return this
    }

    // 验证配置是否符合规则
    checkValidate(config: any, validateSchema: Joi.ObjectSchema<any>) {
        const { error } = validateSchema.validate(config, { abortEarly: false })
        error && error.details.forEach((err: any) => this.errorMessages.push(`- PARAMTER_ERROR: ${err.message}`))

        return this
    }

    async checkRpcLatency(rpcOrChian: SupportChainType | string) {
        let rpc = typeof rpcOrChian === 'string' ? chainState[rpcOrChian as SupportChainType].rpcUrls[0] : rpcOrChian
        const provider = new ethers.providers.JsonRpcProvider(rpc)

        const pattern = /(\S)\/[0-9a-fA-F]+$/;
        const replacement = "$1/<PRIVATE_NODE>";
        const regex = new RegExp(pattern);
        const showRpc = rpc.replace(regex, replacement);

        try {
            const startTime = Date.now()
            await provider.getBlockNumber()
            const latencyTime = Date.now() - startTime

            this.successMessages.push(`- Latency: ${latencyTime}ms (${showRpc})`)
        } catch (error: any) {
            this.errorMessages.push(`- ${error.code}: ${error.reason}  (${showRpc})`)
        }
        return this
    }
}