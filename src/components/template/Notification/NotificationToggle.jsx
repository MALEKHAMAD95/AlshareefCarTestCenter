import classNames from '@/utils/classNames'
import Badge from '@/components/ui/Badge'
import NotificationsSvg from '@/assets/svg/SystemIcons/NotificationsSvg'

const NotificationToggle = ({ className, dot }) => {
    return (
        <div className={classNames('text-2xl', className)}>
            {dot ? (
                <Badge badgeStyle={{ top: '3px', right: '6px' }}>
                    <NotificationsSvg width={24} height={24}/>
                </Badge>
            ) : (
                <NotificationsSvg width={24} height={24}/>
            )}
        </div>
    )
}

export default NotificationToggle
