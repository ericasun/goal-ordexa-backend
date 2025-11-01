// 产品-定义前端传入的字段映射

// 产品包装字段
export interface ProductPackage {
  id:   number
  packageLength: number;
  packageWidth:  number;
  packageHeight: number;
  packageWeight: number;
  packingTemplateName: string;
}

export interface cartonPackage {
  id:  number;
  cartonLength:    number;
  cartonWidth:     number;
  cartonHeight:    number;
  cartonWeight:    number;

  unitsPerCarton:      number;    // 每箱多少个产品
  cartonTemplateName:  string;    // 外箱装箱模板名称
}

// 产品字段
export interface ProductInput{
  id:               number;
  sku:              string;
  model:            string;       
  productName:      string;
  productAlias?:    string;

  createdAt:       string;    
  updatedAt:       string;
}

// 产品新增字段
export interface ProductAddInput extends ProductInput {
  description?:     string;

  // 尺寸 & 重量（统一用 cm / kg）
  productLength?:    number;
  productWidth?:     number;
  productHeight?:    number;
  productWeight?:    number;
  
  // 关联表
  // packages:        ProductPackage[];    
  // inventories   Inventory[]
  packages: (ProductPackage & { cartonConfigs: cartonPackage[] })[]; // 产品包装表
}

// 产品搜索字段
export interface ProductSearchInput extends ProductInput, cartonPackage {  
  productWeightMin?: number;
  productWeightMax?: number;

  packingTemplateName: string;
  packageWeightMin?: number;
  packageWeightMax?: number;

  cartonTemplateName: string;
  cartonWeightMin?: number;
  cartonWeightMax?: number;
}

