import React, { useMemo } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { PieChart } from "react-native-gifted-charts";

import type { Task } from "@/features/tasks/domain/entities/Task";

type TaskPriorityChartProps = {
  tasks: Task[];
};

const screenWidth = Dimensions.get("window").width;
const chartSize = screenWidth;
const chartRadius = screenWidth * 0.8 * 0.40;

export default function TaskPriorityChart({
  tasks,
}: TaskPriorityChartProps) {
  const { data, totalTasks } = useMemo(() => {
    const highPriorityCount = tasks.filter(
      (task) => task.priority === "high"
    ).length;

    const mediumPriorityCount = tasks.filter(
      (task) => task.priority === "medium"
    ).length;

    const lowPriorityCount = tasks.filter(
      (task) => task.priority === "low"
    ).length;

    const total = highPriorityCount + mediumPriorityCount + lowPriorityCount;

    const getPercentageString = (count: number) =>
      total > 0 ? `${((count / total) * 100).toFixed(0)}%` : "0%";

    return {
      totalTasks: total,
      data: [
        {
          name: "High",
          value: highPriorityCount,
          color: "#EF4444",
          text: getPercentageString(highPriorityCount),
          tooltipText: `High Priority: \n${highPriorityCount} ${highPriorityCount === 1 ? 'task' : 'tasks'}`,
        },
        {
          name: "Medium",
          value: mediumPriorityCount,
          color: "#F59E0B",
          text: getPercentageString(mediumPriorityCount),
          tooltipText: `Medium Priority: \n${mediumPriorityCount} ${mediumPriorityCount === 1 ? 'task' : 'tasks'}`,
        },
        {
          name: "Low",
          value: lowPriorityCount,
          color: "#22C55E",
          text: getPercentageString(lowPriorityCount),
          tooltipText: `Low Priority: \n${lowPriorityCount} ${lowPriorityCount === 1 ? 'task' : 'tasks'}`,
        },
      ],
    };
  }, [tasks]);

  if (totalTasks === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No tasks available
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.chartContainer}>
        <PieChart
          data={data}
          radius={chartRadius}
          showText={true}
          textColor="#FFFFFF"
          textSize={13}
          fontWeight="bold"
          labelsPosition="mid"
          showTooltip={true}
          tooltipHorizontalShift={20}
          tooltipDuration={1500}
          paddingHorizontal={40}
          paddingVertical={40}
          renderTooltip={(item: any) => {
            return (
              <View style={styles.tooltipBox}>
                <Text style={styles.tooltipText}>
                  {item.tooltipText}
                </Text>
              </View>
            );
          }}
        />
      </View>

      <View style={styles.legend}>
        {data.map((item) => (
          <View
            key={item.name}
            style={styles.legendItem}
          >
            <View
              style={[
                styles.legendColor,
                {
                  backgroundColor: item.color,
                },
              ]}
            />
            <Text style={styles.legendText}>
              {item.name}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
    zIndex: 10,
    elevation: 10,
  },
  chartContainer: {
    width: chartSize,
    height: chartSize,
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
    zIndex: 50,
    elevation: 50,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
    marginTop: 12,
    zIndex: 1,
    elevation: 1,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 13,
    color: "#475569",
    fontWeight: "500",
  },
  emptyContainer: {
    height: chartSize,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#64748B",
  },
  tooltipBox: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#1E293B",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#334155",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 99999,
    elevation: 99999,
  },
  tooltipText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
});
