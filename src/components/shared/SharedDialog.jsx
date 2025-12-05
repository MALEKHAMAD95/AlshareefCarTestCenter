import {
    HiCheckCircle,
    HiOutlineInformationCircle,
    HiOutlineExclamation,
    HiOutlineExclamationCircle,
} from 'react-icons/hi'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { HiArchiveBoxXMark } from "react-icons/hi2";

const StatusIcon = ({ status }) => {
    switch (status) {
        case 'info':
            return (
                <Avatar
                    className="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-100"
                    shape="circle"
                >
                    <span className="text-2xl">
                        <HiOutlineInformationCircle />
                    </span>
                </Avatar>
            )
        case 'success':
            return (
                <Avatar
                    className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100"
                    shape="circle"
                >
                    <span className="text-2xl">
                        <HiCheckCircle />
                    </span>
                </Avatar>
            )
        case 'warning':
            return (
                <Avatar
                    className="text-amber-600 bg-amber-100 dark:text-amber-100"
                    shape="circle"
                >
                    <span className="text-2xl">
                        <HiOutlineExclamationCircle />
                    </span>
                </Avatar>
            )
  case 'danger':
            return (
                <Avatar
                    className="text-white bg-red-600 dark:bg-red-600"
                    shape="circle"
                >
                    <span className="text-2xl">
                <HiArchiveBoxXMark />
                    </span>
                </Avatar>
            );
        default:
            return null;
    }
};

const SharedDialog = (props) => {
    const {
        type = '', //info
        title,
        children,
        onCancel,
        onConfirm,
        cancelText = 'Cancel',
        confirmText = 'Confirm',
        confirmButtonProps,
        cancelButtonProps,
        width,
        height,
        ...rest
    } = props

    const handleCancel = () => {
        onCancel?.()
    }

    const handleConfirm = () => {
        onConfirm?.()
    }


    return (
<Dialog contentClassName="pb-0 px-0" width={width} height={height} {...rest}>
<div className="px-3 pb-2 pt-2 ">
                <div>
                    <StatusIcon status={type || null} />
                </div>
                <div className="ml-0 rtl:mr-0">
                    <h5 className="ml-4 rtl:mr-4 mb-2">{title}</h5>
                    {children}
                </div>
            </div>
            <div className="px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-bl-2xl rounded-br-2xl">
                <div className="flex justify-end items-center gap-2">
                    <Button
                        size="sm"
                        onClick={handleCancel}
                        {...cancelButtonProps}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        size="sm"
                        variant="solid"
                        onClick={handleConfirm}
                        {...confirmButtonProps}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default SharedDialog
