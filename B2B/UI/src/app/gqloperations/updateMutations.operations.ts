import { gql } from "apollo-angular";


export const UPDATE_MASTER = gql`
    mutation updateMaster($masterUpdateInput : MasterUpdateInput){
        updateMaster(masterUpdateInput : $masterUpdateInput){
            masterCategory
            masterName
        }
    }
`

export const UPDATE_MANAGER = gql`
    mutation updateManager($updateManagerDto : UpdateManagerDto){
        updateManager(updateManagerDto: $updateManagerDto){
            ll2Manager
            ll3Manager
            ll4Manager
            ll5Manager
            ll6Manager
          }
    }
`



export const UPDATE_PRODUCT_LINE = gql`
    mutation updateProductLine($updateProductLineDto : UpdateProductLineDto){
        updateProductLine(updateProductLineDto : $updateProductLineDto){
            id{
                buId
                productLineId
              }
              buName
              productLineName
            
        }
    }
`

export const UPDATE_BUSINESS_UNIT = gql`
  mutation updateBusinessUnit($updateBusinessUnitDto: UpdateBusinessUnitDto){
    updateBusinessUnit(updateBusinessUnitDto: $updateBusinessUnitDto){
        id{
          buId
          productLineId
        }
        buName
        productLineName
    }
  }
`


