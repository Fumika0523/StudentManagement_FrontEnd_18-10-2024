import React from 'react'
import { ChartCard } from './ChartCard'
import DonutCard from './DonutCard'

const ChartDisplay = () => {
  return (
    <>
    <div className=' w-100 row border d-flex align-items-center mx-auto justify-content-center'>
        <ChartCard/>
        <DonutCard/>
    </div>
    </>
  )
}

export default ChartDisplay