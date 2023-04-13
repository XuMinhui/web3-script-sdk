import { omitAddress } from './utils'

describe(`# test utils`, () => {
    it(`# omit address`, () => {
        expect(omitAddress(omitAddress(`0x8a700B2738503f5E0C3Cba51B9a6640cD05c4CB9`))).toContain('0x8a70...4CB9')
    })
})