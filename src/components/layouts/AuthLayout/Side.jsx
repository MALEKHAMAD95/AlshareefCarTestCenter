import { cloneElement } from 'react'

const Side = ({ children, ...rest }) => {
    return (
        <div className="flex h-full p-6 bg-white dark:bg-slate-900">
            <div className=" flex flex-col justify-center items-center flex-1">
                <div className="w-full ">
                    {children
                        ? cloneElement(children, {
                              ...rest,
                          })
                        : null}
                </div>
            </div>
 
        </div>
    )
}

export default Side
