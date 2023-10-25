import { gql } from "apollo-angular"

export const ADD_MASTER = gql`
  mutation addMasterData($masterInput: MasterInput!){
    addMasterData(masterInput: $masterInput){
      masterId
      masterCategory
      masterName
    }
  }
`

export const ADD_MANAGER = gql`
  mutation addManager($managerDto: ManagerDto!){
    addManager(managerDto:$managerDto){
        ll2Manager
        ll3Manager
        ll4Manager
        ll5Manager
        ll6Manager
      }
  }
`
export const ADD_BUSINESS_UNIT = gql`
  mutation addBusinessUnit($businessUnitDto : BusinessUnitDto){
    addBusinessUnit(businessUnitDto : $businessUnitDto){
      id{
        buId
        productLineId
      }
      buName
      productLineName
    }
  }
`

export const ADD_PRODUCT_LINE = gql`
    mutation addProductLine($addProductLineDto : AddProductLineDto){
        addProductLine(addProductLineDto : $addProductLineDto){
            id{
                buId
                productLineId
              }
              buName
              productLineName
            
        }
    }
`





