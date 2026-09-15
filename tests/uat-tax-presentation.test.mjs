import test from 'node:test'
import assert from 'node:assert/strict'
import { taxPresentation } from '../src/utils/pricingPresentation.js'
test('UAT snapshot hides tax lines without representing approved zero GST', () => {
 assert.deepEqual(taxPresentation({taxMode:'UAT_BYPASS',policyStatus:'uat_bypass',tax:{totalTax:0}}),{mode:'none'})
})
