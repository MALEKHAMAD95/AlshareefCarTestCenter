import { useEffect, useState } from 'react';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { useTranslation } from 'react-i18next';
import { useTranslationValue } from '@/locales';
import ActionLevel from '../../Enum/ActionLevel ';

export default function SaveSharedDialog({
    show,
    handleClose,
    setAlert,
    setFormData,
    controls,
    shippingStatus,
    status, // Add status prop to handle Approved orders
    translationPath = 'views.Order.',
}) {
    const { t } = useTranslation(useTranslationValue);
    const [dialogType, setDialogType] = useState(null);
    const [dialogMessage, setDialogMessage] = useState('');
    const [dialogTitle, setDialogTitle] = useState('');

    const dialogStyle = {
        overlay: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
        },
        content: {
            width: 'auto',
            maxWidth: '500px',
            margin: '0',
            top: 'auto',
            bottom: 'auto',
            transform: 'none',
        },
    };

useEffect(() => {
    if (show && controls && (shippingStatus !== undefined || status !== undefined)) {
        let relevantControl;

        // Map to the three cases: Delivered, Partially Delivered, Approved
        if (shippingStatus === 0) {
            // Case 1: Delivered (CHECKDELIVERDSTATUS, setval: "2" → Block)
            relevantControl = controls.find(c => c.setkey === 'CHECKDELIVERDSTATUS');
        } else if (shippingStatus === 1) {
            // Case 2: Partially Delivered (CHECKPARTIALDELIVERDSTATUS, setval: "1" → Warn)
            relevantControl = controls.find(c => c.setkey === 'CHECKPARTIALDELIVERDSTATUS');
        } else if (shippingStatus !== undefined) {
            // Not Delivered (proceed normally, no dialog)
            setFormData && setFormData({ action: 'proceed' });
            closeAll();
            return;
        } else if (status === 4) {
            // Case 3: Approved (CHECKAPPROVEDSTATUS, setval: "1" → Warn)
            relevantControl = controls.find(c => c.setkey === 'CHECKAPPROVEDSTATUS');
        } else {
            // Other status values (Proposal, Rejected, Unknown) - proceed normally
            setFormData && setFormData({ action: 'proceed' });
            closeAll();
            return;
        }



        if (relevantControl) {
            const selectedOption = relevantControl.setoptions.find(
                opt => opt._value === relevantControl.setval
            );
            const actionValue = parseInt(relevantControl.setval);

            if (actionValue === ActionLevel.Proceed) {
                setFormData && setFormData({ action: 'proceed' });
                closeAll();
            } else if (actionValue === ActionLevel.Warn) {
                setDialogType('warning');
                setDialogTitle(t(`${translationPath}Warning`) || 'Warning');
                setDialogMessage(
                    t(`${translationPath}NegativeBalanceWarning`) ||
                    `Are you sure you want to update ${relevantControl.setname}?`
                );
            } else if (actionValue === ActionLevel.Block) {
                setDialogType('danger');
                setDialogTitle(t(`${translationPath}Blocked`) || 'Blocked');
                setDialogMessage(
                    t(`${translationPath}BlockedMessage`) ||
                    `Updating ${relevantControl.setname} is blocked and cannot be completed.`
                );
            }
        } else {
            // Fallback if no control is found
            if (shippingStatus === 0) {
                setDialogType('danger'); // Block for Delivered
                setDialogTitle(t(`${translationPath}Blocked`) || 'Blocked');
                setDialogMessage(
                    t(`${translationPath}BlockedMessage`) ||
                    'Updating delivered orders is blocked.'
                );
            } else if (shippingStatus === 1) {
                setDialogType('warning'); // Warn for Partially Delivered
                setDialogTitle(t(`${translationPath}Warning`) || 'Warning');
                setDialogMessage(
                    t(`${translationPath}NegativeBalanceWarning`) ||
                    'Are you sure you want to update partially delivered orders?'
                );
            } else if (status === 4) {
                setDialogType('warning'); // Warn for Approved
                setDialogTitle(t(`${translationPath}Warning`) || 'Warning');
                setDialogMessage(
                    t(`${translationPath}NegativeBalanceWarning`) ||
                    'Are you sure you want to update approved orders?'
                );
            }
        }
    }
}, [show, controls, shippingStatus, status, t, translationPath]);

    const handleConfirm = () => {
        if (dialogType === 'danger') {
            closeAll();
        } else if (dialogType === 'warning') {
            setAlert({
                message: t(`${translationPath}ConfirmedMessage`) || 'Action confirmed.',
                type: 'success',
            });
            setFormData && setFormData({ action: 'proceed' });
            closeAll();
        }
    };

    const closeAll = () => {
        setDialogType(null);
        handleClose();
    };

    return (
        <>
            <ConfirmDialog
                isOpen={dialogType === 'warning'}
                type="warning"
                title={dialogTitle}
                cancelText={t(`${translationPath}No`) || 'No'}
                confirmText={t(`${translationPath}Yes`) || 'Yes'}
                onClose={closeAll}
                onCancel={closeAll}
                onConfirm={handleConfirm}
                style={dialogStyle}
            >
                <p>{dialogMessage}</p>
            </ConfirmDialog>

            <ConfirmDialog
                isOpen={dialogType === 'danger'}
                type="danger"
                title={dialogTitle}
                confirmText={t(`${translationPath}Close`) || 'Close'}
                onClose={closeAll}
                onCancel={closeAll}
                onConfirm={closeAll}
                HideConfirm
                style={dialogStyle}
            >
                <p>{dialogMessage}</p>
                <p className="text-red-600 font-semibold">Error Code: BLOCKED_ACTION</p>
            </ConfirmDialog>
        </>
    );
}