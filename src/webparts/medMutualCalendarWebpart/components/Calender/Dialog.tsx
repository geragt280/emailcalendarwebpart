import * as React from 'react';
import styles from '../MedMutualCalendarWebpart.module.scss';
import {
    getTheme,
    Modal,
    IIconProps,
    IButtonStyles,
    IconButton,
    Icon,
    PrimaryButton,
} from 'office-ui-fabric-react';
import { useId } from '@fluentui/react-hooks';
import { DialogBodyProps } from './DialogBodyProps';

const theme = getTheme();
const cancelIcon: IIconProps = { iconName: 'Cancel' };
const iconButtonStyles: Partial<IButtonStyles> = {
    root: {
        color: theme.palette.neutralPrimary,
        marginLeft: 'auto',
        marginTop: '4px',
        marginRight: '2px',
    },
    rootHovered: {
        color: theme.palette.neutralDark,
    },
};
type DialogProps = {
    hideModal: () => void;
    selectedItem: DialogBodyProps | undefined;
    categoryColor: string;
};


const Dialog: React.FunctionComponent<DialogProps> = ({ hideModal, selectedItem, categoryColor }) => {
    const [moreDetails, setMoreDetails] = React.useState<boolean>(false);
    const titleId = useId('title');

    const viewMoreDetails = () => {
        setMoreDetails(true);

    }
    return (
        <div>

            <Modal
                titleAriaId={titleId}
                onDismiss={hideModal}
                isOpen={true}
                isBlocking={false}
                containerClassName={styles.container}
            >

                <div className={styles.header}>
                    <h2 className={styles.heading}
                        id={titleId}
                    >
                        Calendar Event Details
                    </h2>
                    <IconButton
                        styles={iconButtonStyles}
                        iconProps={cancelIcon}
                        ariaLabel="Close popup modal"
                        onClick={hideModal}
                    />
                </div>
                <div className={styles.body}>
                    <div style={{ display: 'flex', position: 'relative', flexDirection: 'column' }}>
                        <div style={{ width: 450, height: 40, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <div style={{ width: 60, height: 40, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}><Icon iconName='EventInfo' style={{ fontSize: 25, color: categoryColor }} /></div>
                            <div style={{ width: 440, height: 40, display: 'flex', flexDirection: 'row', alignItems: 'center', paddingRight: 5, paddingLeft: 15, borderBottom: '1px solid rgba(0, 0, 0, 0.1)', fontSize: 21, fontWeight: 600 }}><p>{selectedItem.eventSubject}</p></div>
                        </div>
                        <div style={{ width: 450, height: 40, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <div style={{ width: 60, height: 40, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}><Icon iconName='Clock' style={{ fontSize: 20, color: categoryColor }} /></div>
                            <div style={{ width: '100%', height: 40, display: 'flex', flexDirection: 'row', alignItems: 'center', paddingRight: 5, paddingLeft: 15, borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}><p>{selectedItem.eventStartDate}</p></div>
                        </div>
                        <div style={{ width: 450, height: 40, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <div style={{ width: 60, height: 40, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}><Icon iconName='KnowledgeArticle' style={{ fontSize: 20, color: categoryColor }} /></div>
                            <div style={{ width: 440, height: 40, display: 'flex', flexDirection: 'row', alignItems: 'center', paddingRight: 5, paddingLeft: 15, borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}><p>{selectedItem.eventDescription}</p></div>
                        </div>
                        <div style={{ width: 450, height: 40, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <div style={{ width: 60, height: 40, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}><Icon iconName='Tag' style={{ fontSize: 20, color: categoryColor }} /></div>
                            <div style={{ width: 440, height: 40, display: 'flex', flexDirection: 'row', alignItems: 'center', paddingRight: 5, paddingLeft: 15, borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}><p>{selectedItem.eventCategory}</p></div>
                        </div>
                        { !moreDetails ? 
                            <div style={{ width: 450, alignItems: 'center', padding: 10, display: 'flex', flexDirection: 'column' }}>
                                <PrimaryButton text="More Details" onClick={viewMoreDetails} allowDisabledFocus checked={true} />
                            </div> : <>
                                <div style={{ width: 450, height: 40, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <div style={{ width: 60, height: 40, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}><Icon iconName='Tag' style={{ fontSize: 20, color: categoryColor }} /></div>
                                    <div style={{ width: 440, height: 40, display: 'flex', flexDirection: 'row', alignItems: 'center', paddingRight: 5, paddingLeft: 15, borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}><p>{selectedItem.eventIsAllDay}</p></div>
                                </div>
                                <div style={{ width: 450, height: 40, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <div style={{ width: 60, height: 40, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}><Icon iconName='Tag' style={{ fontSize: 20, color: categoryColor }} /></div>
                                    <div style={{ width: 440, height: 40, display: 'flex', flexDirection: 'row', alignItems: 'center', paddingRight: 5, paddingLeft: 15, borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}><p>{selectedItem.eventPriority}</p></div>
                                </div>
                                <div style={{ width: 450, height: 40, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <div style={{ width: 60, height: 40, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}><Icon iconName='Tag' style={{ fontSize: 20, color: categoryColor }} /></div>
                                    <div style={{ width: 440, height: 40, display: 'flex', flexDirection: 'row', alignItems: 'center', paddingRight: 5, paddingLeft: 15, borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}><p>{selectedItem.evnetTimeZone}</p></div>
                                </div>
                            </>
                        }
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default Dialog;
