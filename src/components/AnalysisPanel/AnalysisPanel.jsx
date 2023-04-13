import { Pivot, PivotItem } from "@fluentui/react";
import DOMPurify from "dompurify";

// import styles from "./AnalysisPanel.module.css";

import { SupportingContent } from "../SupportingContent";
import { AnalysisPanelTabs } from "./AnalysisPanelTabs";

const pivotItemDisabledStyle = { disabled: true, style: { color: "grey" } };

export const AnalysisPanel = ({
  answer,
  activeTab,
  activeCitation,
  citationHeight,
  className,
  onActiveTabChanged,
}) => {
  const isDisabledSupportingContentTab = !answer.citations.length;
  const isDisabledCitationTab = !activeCitation;

  //   const sanitizedThoughts = DOMPurify.sanitize(answer.thoughts);

  return (
    <Pivot
      className={className}
      selectedKey={activeTab}
      onLinkClick={(pivotItem) =>
        pivotItem && onActiveTabChanged(pivotItem.props.itemKey)
      }
    >
      <PivotItem
        itemKey={AnalysisPanelTabs.SupportingContentTab}
        headerText="Supporting content"
        headerButtonProps={
          isDisabledSupportingContentTab ? pivotItemDisabledStyle : undefined
        }
      >
        <SupportingContent supportingContent={answer.citations} />
      </PivotItem>
      <PivotItem
        itemKey={AnalysisPanelTabs.CitationTab}
        headerText="Citation"
        headerButtonProps={
          isDisabledCitationTab ? pivotItemDisabledStyle : undefined
        }
      >
        <iframe
          title="Citation"
          src={activeCitation}
          width="100%"
          height={citationHeight}
        />
      </PivotItem>
    </Pivot>
  );
};
