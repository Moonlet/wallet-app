import React from 'react';
import { View } from 'react-native';
import { Button } from '../../library';
import { ICta, IScreenModule, IScreenModuleColumnsWrapperData, ModuleTypes } from './types';
import { ImageBanner } from './components/image-banner/image-banner';
import { StaticTextColTopHeader } from './components/static-text-col-top-header/static-text-col-top-header';
import { StaticTextColBottomHeader } from './components/static-text-col-bottom-header/static-text-col-bottom-header';
import { BalanceGridIcons } from './components/balance-grid-icons/balance-grid-icons';
import { ExpandableContainer } from '../expandable-container/expandable-container';
import { IconTwoLines } from './components/icon-two-lines/icon-two-lines';
import { ModuleWrapper } from './components/module-wrapper/module-wrapper';
import { OneLineTextBanner } from './components/one-line-text-banner/one-line-text-banner';
import { Separator } from './components/separator/separator';
import { SingleBalanceIcon } from './components/single-balance-icon/single-balance-icon';
import { ThreeLinesCta } from './components/three-lines-cta/three-lines-cta';
import { ThreeLinesIcon } from './components/three-lines-icon/three-lines-icon';
import { TwoLinesStakeBanner } from './components/two-lines-text-banner/two-lines-text-banner';
import { formatStyles } from './utils';
import { IconModule } from './components/icon/icon';
import { handleCta } from '../../redux/ui/screens/data/actions';
import { MdText } from './components/md-text/md-text';
import { AmountInput } from './components/amount-input/amount-input';

const renderModules = (
    modules: IScreenModule[],
    actions: {
        handleCta: typeof handleCta;
    },
    options?: {
        screenKey?: string;
        isWidgetExpanded?: boolean;
        style?: any;
        colWrapperStyle?: any;
        moduleColWrapperContainer?: any;
    }
) => {
    const renderedModulesJSX = modules.map((m: IScreenModule, i: number) => (
        <React.Fragment key={`screen-module-${i}`}>
            {renderModule(m, actions, options)}
        </React.Fragment>
    ));

    let modulesJSX: any;
    if (options?.colWrapperStyle) {
        modulesJSX = (
            <View style={[options?.moduleColWrapperContainer, options.colWrapperStyle]}>
                {renderedModulesJSX}
            </View>
        );
    } else {
        modulesJSX = <View>{renderedModulesJSX}</View>;
    }

    return modulesJSX;
};

export const renderModule = (
    module: IScreenModule,
    actions: {
        handleCta: typeof handleCta;
    },
    options?: {
        screenKey?: string;
        isWidgetExpanded?: boolean;
        style?: any;
        moduleColWrapperContainer?: any;
        moduleWrapperState?: string;
    }
) => {
    let moduleJSX = null;

    if (module?.hidden === true) {
        // Hide module
        return moduleJSX;
    }

    switch (module.type) {
        case ModuleTypes.STATIC_TEXT_COLUMNS_TOP_HEADER:
            moduleJSX = <StaticTextColTopHeader module={module} />;
            break;

        case ModuleTypes.STATIC_TEXT_COLUMNS_BOTTOM_HEADER:
            moduleJSX = <StaticTextColBottomHeader module={module} />;
            break;

        case ModuleTypes.THREE_LINES_CTA:
            moduleJSX = <ThreeLinesCta module={module} actions={actions} />;
            break;

        case ModuleTypes.BALANCES_GRID_ICONS:
            moduleJSX = <BalanceGridIcons module={module} />;
            break;

        case ModuleTypes.SEPARATOR:
            moduleJSX = <Separator module={module} />;
            break;

        case ModuleTypes.SINGLE_BALANCE_ICON:
            moduleJSX = <SingleBalanceIcon module={module} />;
            break;

        case ModuleTypes.IMAGE_BANNER:
            moduleJSX = <ImageBanner module={module} actions={actions} />;
            break;

        case ModuleTypes.TWO_LINES_TEXT_BANNER:
            moduleJSX = <TwoLinesStakeBanner module={module} actions={actions} />;
            break;

        case ModuleTypes.ONE_LINE_TEXT_BANNER:
            moduleJSX = <OneLineTextBanner module={module} actions={actions} options={options} />;
            break;

        case ModuleTypes.THREE_LINES_ICON:
            moduleJSX = <ThreeLinesIcon module={module} />;
            break;

        case ModuleTypes.ICON_TWO_LINES:
            moduleJSX = <IconTwoLines module={module} />;
            break;

        case ModuleTypes.ICON:
            moduleJSX = <IconModule module={module} />;
            break;

        case ModuleTypes.MD_TEXT:
            moduleJSX = <MdText module={module} />;
            break;

        case ModuleTypes.MODULE_WRAPPER:
            moduleJSX = (
                <ModuleWrapper
                    module={module}
                    renderModule={m => renderModule(m, actions, options)}
                    moduleWrapperState={options?.moduleWrapperState}
                />
            );
            break;

        case ModuleTypes.MODULE_COLUMNS_WRAPPER:
            const colWrapperData = module.data as IScreenModuleColumnsWrapperData;
            moduleJSX = renderModules(colWrapperData.submodules, actions, {
                ...options,
                colWrapperStyle:
                    (module?.style && formatStyles(module?.style)) ||
                    (colWrapperData?.style && formatStyles(colWrapperData.style)) ||
                    {}
            });
            break;

        case ModuleTypes.CTA:
            moduleJSX = module?.cta && renderCta(module.cta, actions.handleCta);
            break;

        case ModuleTypes.AMOUNT_INPUT:
            moduleJSX = <AmountInput module={module} screenKey={options?.screenKey} />;
            break;

        default:
            return null;
    }

    if (options?.isWidgetExpanded === undefined) {
        return moduleJSX;
    } else {
        if (!module?.displayWhen) {
            return moduleJSX;
        }

        let showModule = false;
        if (!module?.displayWhen || options?.isWidgetExpanded) {
            showModule = true;
        }

        return (
            <View>
                <ExpandableContainer isExpanded={showModule}>{moduleJSX}</ExpandableContainer>
            </View>
        );
    }
};

export const renderCta = (cta: ICta, handleCTA: typeof handleCta) => {
    return (
        <Button
            primary={cta?.buttonProps?.primary}
            secondary={cta?.buttonProps?.secondary}
            disabled={cta?.buttonProps?.disabled}
            leftIcon={cta?.buttonProps?.leftIcon}
            wrapperStyle={
                cta?.buttonProps?.wrapperStyle && formatStyles(cta.buttonProps.wrapperStyle)
            }
            style={
                cta?.buttonProps?.colors?.bg && {
                    backgroundColor: cta.buttonProps.colors.bg,
                    borderColor: cta.buttonProps.colors.bg
                }
            }
            onPress={() => handleCTA(cta)}
        >
            {cta?.label || ''}
        </Button>
    );
};
