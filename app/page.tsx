import { Button } from '@/components/ui/button'
import React from 'react'

const page = () => {
  return (
    <div className=''>
      Transactions
      <Button className='fixed bottom-1 right-1 h-8 w-8 rounded-full text-xl lg:text-5xl lg:h-16 lg:w-16 bg-red-400 dark:bg-red-600 dark:text-white'>+</Button>
    </div>
  )
}

export default page
