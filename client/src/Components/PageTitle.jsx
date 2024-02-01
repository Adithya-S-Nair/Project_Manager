import React from 'react'

const PageTitle = ({ titleText, titleIcon }) => {
    return (
        <div className='mb-5'>
            <div className="flex items-center gap-5">
                <>
                    {titleIcon}
                </>
                <h1 className='text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight'>{titleText}</h1>
            </div>
            <hr className='mt-2' />
        </div>
    )
}

export default PageTitle