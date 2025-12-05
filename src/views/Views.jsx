import { Suspense } from 'react'
import Loading from '@/components/shared/Loading'
import AllRoutes from '@/components/route/AllRoutes'

const Views = (props) => {
    return (
        <Suspense fallback={<Loading loading={true} className="w-full" />}>
            <AllRoutes {...props} />
        </Suspense>
    )
}

export default Views
