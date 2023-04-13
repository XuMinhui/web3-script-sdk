import { Web3Checker } from './Checker'

describe(`# test checker`, () => {
    it(`# string is address`, () => {
        expect(Web3Checker.isAddress(`0x8a700B2738503f5E0C3Cba51B9a6640cD05c4CB9`)).toBeTruthy()
        expect(Web3Checker.isAddress(`12345`)).not.toBeTruthy()
    })

    it(`# string is hash`, () => {
        expect(Web3Checker.isTxHash(`0x8a700B2738503f5E0C3Cba51B9a6640cD05c4CB9`)).toBeFalsy()
        expect(Web3Checker.isTxHash(`0xd03488dd1a05fef17aef55759968ba15ec9984d1f7837a1eb4b102442e458881`)).toBeTruthy()
    })
})