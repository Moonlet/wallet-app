import React from 'react';
import { View } from 'react-native';
import { IScreenModule, IScreenModuleColumnsWrapperData, ModuleTypes } from './types';
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
import { IAccountState } from '../../redux/wallets/state';
import { ChainIdType } from '../../core/blockchain/types';
import { formatStyles } from './utils';

const renderModules = (
    modules: IScreenModule[],
    options?: {
        account: IAccountState;
        chainId: ChainIdType;
        actions: any;

        isWidgetExpanded?: boolean;

        style?: any;
        colWrapperStyle?: any;
        moduleColWrapperContainer?: any;
    }
) => {
    const renderedModulesJSX = modules.map(m => renderModule(m, options));

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
    options: {
        account: IAccountState;
        chainId: ChainIdType;
        actions: any;

        isWidgetExpanded?: boolean;
        style?: any;
        moduleColWrapperContainer?: any;
    }
) => {
    let moduleJSX = null;

    switch (module.type) {
        case ModuleTypes.STATIC_TEXT_COLUMNS_TOP_HEADER:
            moduleJSX = <StaticTextColTopHeader module={module} />;
            break;

        case ModuleTypes.STATIC_TEXT_COLUMNS_BOTTOM_HEADER:
            moduleJSX = <StaticTextColBottomHeader module={module} />;
            break;

        case ModuleTypes.THREE_LINES_CTA:
            moduleJSX = (
                <ThreeLinesCta
                    module={module}
                    actions={options.actions}
                    account={options.account}
                />
            );
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
            moduleJSX = <ImageBanner module={module} />;
            break;

        case ModuleTypes.TWO_LINES_TEXT_BANNER:
            moduleJSX = (
                <TwoLinesStakeBanner
                    module={module}
                    account={options.account}
                    chainId={options.chainId}
                />
            );
            break;

        case ModuleTypes.ONE_LINE_TEXT_BANNER:
            moduleJSX = <OneLineTextBanner module={module} />;
            break;

        case ModuleTypes.THREE_LINES_ICON:
            moduleJSX = <ThreeLinesIcon module={module} />;
            break;

        case ModuleTypes.ICON_TWO_LINES:
            moduleJSX = <IconTwoLines module={module} />;
            break;

        case ModuleTypes.MODULE_WRAPPER:
            moduleJSX = (
                <ModuleWrapper module={module} renderModule={m => renderModule(m, options)} />
            );
            break;

        case ModuleTypes.MODULE_COLUMNS_WRAPPER:
            const colWrapperData = module.data as IScreenModuleColumnsWrapperData;
            moduleJSX = renderModules(colWrapperData.submodules, {
                ...options,
                colWrapperStyle: colWrapperData?.style ? formatStyles(colWrapperData.style) : {}
            });
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
