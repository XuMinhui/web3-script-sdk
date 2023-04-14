import { BigNumber, ethers } from "ethers";
import { bn_fromWei, bn_parseWei, bn_toWei } from "../utils/bn";
import { chainState } from "../web3/chainState";
import { MAX_ALLOWANCE, ZERO_ADDRESS } from "../web3/constants";
import { CurrencyType, SupportChainType } from "../web3/type";
import { UniversalErc20__factory } from "../web3";

class CurrencyModel {
    protected provider: ethers.providers.Provider

    readonly chain: SupportChainType
    readonly type: CurrencyType
    readonly address: string

    public name: string | undefined
    public symbol: string | undefined
    public decimals: number = 18

    constructor(chain: SupportChainType, type: CurrencyType, address: string) {
        const provider = new ethers.providers.JsonRpcProvider(chainState[chain].rpcUrls[0])
        this.provider = provider
        this.chain = chain
        this.type = type
        this.address = address
    }
}

export class CurrencyNative extends CurrencyModel {
    constructor(chain: SupportChainType) {
        super(chain, 'NATIVE', ZERO_ADDRESS)
        this.name = chainState[chain].nativeCurrency.name
        this.symbol = chainState[chain].nativeCurrency.symbol
        this.decimals = chainState[chain].nativeCurrency.decimals
    }

    async balanceOf(account: string | ethers.Wallet) {
        const address = typeof account === 'string' ? account : account.address
        const _balance = await this.provider.getBalance(address)
        return bn_parseWei(_balance, this.decimals)
    }

    async amountOf(account: string | ethers.Wallet, fixed = 4) {
        const address = typeof account === 'string' ? account : account.address
        const _balance = await this.provider.getBalance(address)
        return bn_fromWei(_balance, this.decimals, fixed)
    }

    async transfer(signer: ethers.Wallet, toAddress: string, amount: 'Max' | number, multiple = 1) {
        signer = signer.connect(this.provider)
        let amountBn: BigNumber
        let gasPriceBn = await this.provider.getGasPrice()
        let gasLimit = 21000

        let gasPrice = gasPriceBn.div(10000).mul((multiple * 10000).toFixed(0))

        if (amount === 'Max') {
            const balanceBn = await this.provider.getBalance(signer.address)
            amountBn = balanceBn.sub(gasPrice.mul(gasLimit))
        } else {
            amountBn = ethers.utils.parseEther(`${amount}`)
        }

        if (amountBn.lte(0)) throw new Error("The balance is invalid");

        const transaction: ethers.utils.Deferrable<ethers.providers.TransactionRequest> = {
            to: toAddress,
            value: amountBn,
            gasPrice: gasPrice,
            gasLimit: gasLimit
        }

        await signer.estimateGas(transaction)
        return signer.sendTransaction(transaction)
    }
}

export class CurrencyErc20 extends CurrencyModel {
    public readonly contract: ethers.Contract

    constructor(chain: SupportChainType, address: string) {
        super(chain, 'ERC20', address)
        this.contract = UniversalErc20__factory.connect(address, this.provider)
        this.initialize()
    }

    async initialize() {
        this.symbol = this.symbol && await this.contract.symbol()
        this.decimals = this.decimals && await this.contract.decimals()
        this.name = this.name && await this.contract.name()

        return this
    }

    async balanceOf(account: string | ethers.Wallet) {
        const address = typeof account === 'string' ? account : account.address
        const _amount = await this.contract.balanceOf(address)
        return bn_parseWei(_amount, this.decimals)
    }

    async amountOf(account: string | ethers.Wallet, fixed = 4) {
        const address = typeof account === 'string' ? account : account.address
        const _amount = await this.contract.balanceOf(address)
        return bn_fromWei(_amount, this.decimals, fixed)
    }

    async allowance(owner: string, spender: string) {
        const _allowance = await this.contract.allowance(owner, spender)
        return bn_fromWei(_allowance, this.decimals)
    }

    async approve(signer: ethers.Wallet, spender: string, amount: 'Max' | number) {
        const amountWei = amount === 'Max' ? MAX_ALLOWANCE : bn_toWei(amount, this.decimals)
        const contractWithSigner = this.contract.connect(signer)
        const approveArgs = [spender, amountWei]
        await contractWithSigner.estimateGas.approve(approveArgs)
        return contractWithSigner.approve(approveArgs) as ethers.ContractTransaction
    }

    async transfer(signer: ethers.Wallet, toAddress: string, amount: number | string | 'Max') {
        const contractWithSigner = this.contract.connect(signer)
        let amountWei = amount === 'Max' ? await this.balanceOf(signer.address) : bn_toWei(amount, this.decimals)
        const transferArgs = [toAddress, amountWei]
        await contractWithSigner.estimateGas.transfer(transferArgs)
        return contractWithSigner.transfer(transferArgs)
    }
}