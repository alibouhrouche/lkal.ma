import {Balancer as ReactBalancer} from 'react-wrap-balancer'

export default function Balancer({ value }: { value?: string }) {
    return <ReactBalancer>
        <span className="text">{value}</span>
    </ReactBalancer>
}