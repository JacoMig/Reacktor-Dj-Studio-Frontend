import { ReactNode } from 'react'
import './PeakMeter.css'

const PeakMeter = ({className, children} : {children:ReactNode, className:string}) => {
    return (
        <div className={`meter ${className}`}>
            <div className="levels" id="levels">
                <div className="level" id="level1"></div>
                {children}
                <div className="level" id="level2"></div>
            </div>
        </div>
    )
}

export default PeakMeter
