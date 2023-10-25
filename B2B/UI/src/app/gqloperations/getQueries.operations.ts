import { gql } from "apollo-angular";

export const GET_MASTER_DATA = gql`
  query getMasterData($categoryName: String) {
    getMasterData(categoryName: $categoryName) {
      masterId
      masterCategory
      masterName
    }
  }
`;

export const GET_BUSINESS_UNIT = gql`
  query getBusinessUnitList {
    getBusinessUnitList {
      businessUnitId
      businessUnitName
    }
  }
`;

export const GET_PRODUCT_LINE = gql`
  query getProductList($buName: String) {
    getProductList(buName: $buName) {
      productLineId
      productLineName
    }
  }
`;


export const GET_LL6_MANAGERS = gql`
  query getLL6List {
    getLL6List {
      managerId
      ll6Manager
    }
  }
`;

export const GET_ALL_MANAGERS = gql`
  query getLL6List {
    getLL6List {
      managerId
      ll2Manager
      ll3Manager
      ll4Manager
      ll5Manager
      ll6Manager
    }
  }
`;

export const GET_LL5_MANAGERS = gql`
  query getLL5List {
    getLL5List {
      managerId
      ll2Manager
      ll3Manager
      ll4Manager
      ll5Manager
    }
  }
`;

export const GET_MASTER_CATEGORY =gql`
  query getAllMasterData{
    getAllMasterData{
      masterId
      masterCategory
    }
  }`
;
  

export const GET_MANAGERS = gql`
  query getManagerList($ll6Manager: String) {
    getManagerList(ll6Manager: $ll6Manager) {
      managerId
      ll2Manager
      ll3Manager
      ll4Manager
      ll5Manager
      ll6Manager
    }
  }
`;

export const GET_MASTER_CATEGORY_LIST = gql`
  query getMasterCategories{
    getMasterCategories
  }
`

export  const GET_MANAGERS_BY_LL5 = gql`
query getManagersByLl5Role {
  getManagersByLl5Role
}
`
export  const GET_MANAGERS_BY_LL4 = gql`
query getManagersByLl4Role {
  getManagersByLl4Role
}
`
export  const GET_MANAGERS_BY_LL3 = gql`
query getManagersByLl3Role {
  getManagersByLl3Role
}
`
export  const GET_MANAGERS_BY_LL2 = gql`
query getManagersByLl2Role {
  getManagersByLl2Role
}
`


