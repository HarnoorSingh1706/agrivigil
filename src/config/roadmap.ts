// AgriVigil 9-Stage R&D Roadmap Configuration
// Update `currentStage` (1 to 9) to advance the status badge across the website.

export interface RoadmapStage {
  stage: number;
  titleKey: string;
  descKey: string;
  status: "completed" | "in-progress" | "planned";
}

export const CURRENT_STAGE = 1; // Stage 1: building acoustic prototype

export const roadmapStages: RoadmapStage[] = [
  {
    stage: 1,
    titleKey: "stage1_title",
    descKey: "stage1_desc",
    status: "in-progress", // Currently in progress
  },
  {
    stage: 2,
    titleKey: "stage2_title",
    descKey: "stage2_desc",
    status: "planned",
  },
  {
    stage: 3,
    titleKey: "stage3_title",
    descKey: "stage3_desc",
    status: "planned",
  },
  {
    stage: 4,
    titleKey: "stage4_title",
    descKey: "stage4_desc",
    status: "planned",
  },
  {
    stage: 5,
    titleKey: "stage5_title",
    descKey: "stage5_desc",
    status: "planned",
  },
  {
    stage: 6,
    titleKey: "stage6_title",
    descKey: "stage6_desc",
    status: "planned",
  },
  {
    stage: 7,
    titleKey: "stage7_title",
    descKey: "stage7_desc",
    status: "planned",
  },
  {
    stage: 8,
    titleKey: "stage8_title",
    descKey: "stage8_desc",
    status: "planned",
  },
  {
    stage: 9,
    titleKey: "stage9_title",
    descKey: "stage9_desc",
    status: "planned",
  },
];

// Honest Pilot Metrics that we WILL measure during field validation
export const pilotMetricsToMeasure = [
  {
    id: "accuracy",
    metricKey: "metric_accuracy_title",
    descKey: "metric_accuracy_desc",
    icon: "Target",
  },
  {
    id: "fpr",
    metricKey: "metric_fpr_title",
    descKey: "metric_fpr_desc",
    icon: "ShieldAlert",
  },
  {
    id: "fnr",
    metricKey: "metric_fnr_title",
    descKey: "metric_fnr_desc",
    icon: "EyeOff",
  },
  {
    id: "water",
    metricKey: "metric_water_title",
    descKey: "metric_water_desc",
    icon: "Droplets",
  },
  {
    id: "pesticide",
    metricKey: "metric_pesticide_title",
    descKey: "metric_pesticide_desc",
    icon: "Sparkles",
  },
  {
    id: "loss_reduction",
    metricKey: "metric_loss_title",
    descKey: "metric_loss_desc",
    icon: "TrendingDown",
  },
  {
    id: "roi",
    metricKey: "metric_roi_title",
    descKey: "metric_roi_desc",
    icon: "BadgeIndianRupee",
  },
];
