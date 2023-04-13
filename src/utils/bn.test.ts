import { bn_toHex } from './bn'

describe('# bn.ts', () => {
    it(`# should return hex string`, () => {
        expect(bn_toHex(100)).toBe('0x64')
        expect(bn_toHex(1e18)).toBe('0xde0b6b3a7640000')
        expect(bn_toHex(0x00)).toBe('0x')
        expect(bn_toHex('101.1')).toBe('0x65')
    })
})