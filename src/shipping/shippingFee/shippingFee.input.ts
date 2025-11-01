// 定义前端传入的字段映射
export interface ShippingFeeInput {
  id:               number
  
  cartonConfigId:   number
  companyId:        number
  productSku:       string           
  channel:          string      // "sea" | "air" | "truck"
  cnCompanyName:    string
  enCompanyName:    string
  productName:    string
  costPerCarton:    number
  country:          string
  address:          string
  startDate?:       string
  endDate?:         string
  currency:         string
  remark:           string

  createdAt:       string;    
  updatedAt:       string;
}
