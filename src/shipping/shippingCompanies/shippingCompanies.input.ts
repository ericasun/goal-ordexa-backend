import { ShippingFeeType } from "@/shipping/shippingFee.type"

// 定义前端传入的字段映射
export interface ShippingCompaniesInput {
  id:              number
  cnCompanyName:   string       
  enCompanyName?:  string                     
  code?:           string   
  contactName:     string
  contactPhone:    string
  warehouseAddress:         string         // 仓库地址
  canShipToAmazon?:         boolean        // 是否能发亚马逊仓库
  hasOverseasWarehouse?:    boolean        // 是否有海外仓
  country?:       string
  remark?:        string

  createdAt:      string     
  updatedAt:      string    

  // 一个公司对应多个物流报价
  shippingFees:   ShippingFeeType
}



