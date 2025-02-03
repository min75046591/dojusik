import DetailChart from '@containers/DetailStock/DetailChart'
import StockWebSocket from '@containers/DetailStock/StockWebSocekt'

export default function DetailStock() {
    return (
        <div>
          <DetailChart/>
          <StockWebSocket/>
        </div>
    )
}