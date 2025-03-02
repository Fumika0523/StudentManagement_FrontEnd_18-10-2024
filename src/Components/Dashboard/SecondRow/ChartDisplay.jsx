import React from 'react'
import { ChartCard } from './ChartCard'
import DonutCard from './DonutCard'

const ChartDisplay = () => {
  return (
    <>
    <div className='d-flex justify-content-center align-items-center px-2 border-3 border-primary row'>
        <ChartCard/>
        <DonutCard/>
    </div>
    </>
  )
}

export default ChartDisplay