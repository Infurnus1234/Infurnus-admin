/** Convert explicitly entered reference bounds; never substitute a minimum for a maximum. */
export function perKmReferenceInput(form: {
  perKmRate: string;
  perKmRateMax: string;
}) {
  const amounts = [form.perKmRate, form.perKmRateMax].map((value) => {
    const amount = Number(value);
    if (
      !value.trim() ||
      !Number.isFinite(amount) ||
      amount < 0 ||
      amount > 99999999.99 ||
      !/^\d+(?:\.\d{1,2})?$/.test(String(amount))
    )
      throw Error(
        "Enter both per-km bounds using valid amounts with at most two decimal places.",
      );
    return Math.round(amount * 100);
  });
  if (amounts[1] < amounts[0])
    throw Error("Maximum per-km rate must be at least the minimum.");
  return { minimum: amounts[0], maximum: amounts[1] };
}

export interface SavedPricingReference {
  displayName: string;
  baseFare: { minimum: number; maximum: number | null } | null;
  perKmRate: { minimum: number; maximum: number };
  routeBased?: boolean;
  demandPricing?: {windowSeconds:number;lowBookingCount:number;highBookingCount:number;staleAfterSeconds:number};
}
export function pricingReferenceInput(form:{name:string;pricingMode:string;baseFare:string;baseFareMax:string;perKmRate:string;perKmRateMax:string},previous?:SavedPricingReference|null):SavedPricingReference|null {
  if(form.pricingMode==='fixed') {
    if(previous?.demandPricing) throw Error('Demand-priced categories must retain range or route pricing.');
    return null;
  }
  return {
    displayName:form.name.trim(),
    baseFare:form.pricingMode==='route'?null:{minimum:Math.round(Number(form.baseFare)*100),maximum:form.baseFareMax.trim()?Math.round(Number(form.baseFareMax)*100):null},
    perKmRate:perKmReferenceInput(form),
    ...(form.pricingMode==='route'?{routeBased:true}:{}),
    ...(previous?.demandPricing?{demandPricing:{...previous.demandPricing}}:{}),
  };
}
