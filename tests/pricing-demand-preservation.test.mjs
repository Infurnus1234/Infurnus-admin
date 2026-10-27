import test from 'node:test';
import assert from 'node:assert/strict';
import {pricingReferenceInput} from '../src/lib/pricing-reference-input.ts';
const demandPricing={windowSeconds:300,lowBookingCount:5,highBookingCount:20,staleAfterSeconds:30};
const previous={displayName:'Bike',baseFare:{minimum:1500,maximum:2000},perKmRate:{minimum:500,maximum:800},demandPricing};
const form={name:'Bike',pricingMode:'range',baseFare:'15',baseFareMax:'20',perKmRate:'5',perKmRateMax:'8'};
test('editing rates or labels preserves the actual saved demand policy',()=>{
 const saved=pricingReferenceInput({...form,name:'Bike',perKmRate:'6'},previous);
 assert.deepEqual(saved.demandPricing,demandPricing);assert.deepEqual(saved.perKmRate,{minimum:600,maximum:800});assert.deepEqual(previous.perKmRate,{minimum:500,maximum:800});
});
test('FTL preserves demand policy and route-only status',()=>assert.deepEqual(pricingReferenceInput({...form,name:'FTL',pricingMode:'route',perKmRate:'26',perKmRateMax:'91'},previous),{displayName:'FTL',baseFare:null,perKmRate:{minimum:2600,maximum:9100},routeBased:true,demandPricing}));
test('an explicit scalar mode cannot silently disable demand pricing',()=>assert.throws(()=>pricingReferenceInput({...form,pricingMode:'fixed'},previous),/retain range or route/));
test('legacy scalar updates clear incompatible range references; no demand policy invented',()=>{
 assert.equal(pricingReferenceInput({...form,pricingMode:'fixed'},null),null);assert.equal(pricingReferenceInput(form,null).demandPricing,undefined);
});
