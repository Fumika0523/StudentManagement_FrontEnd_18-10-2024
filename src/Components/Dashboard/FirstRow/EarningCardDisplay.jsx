import EarningCard from "./EarningCard"
import {earningCardList} from '../../utils/constant'

function EarningCardDisplay(){
    return(
        <>
        <div className="d-flex border" >
            {
                earningCardList.map((element,index)=> <EarningCard {...element} key={index}/>
                )
            }
       
    
        </div>
        </>
    )
}
export default EarningCardDisplay