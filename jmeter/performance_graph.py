import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# === Data Setup ===
data = {
    'Source': ['Redis', 'Database'],
    'Count': [9999, 10001],
    'Average Response Time (ms)': [6.59, 29.38],
    'Min Response Time (ms)': [0, 1],
    'Max Response Time (ms)': [52, 97]
}

df = pd.DataFrame(data)

# === Bar Chart: Average Response Time ===
plt.figure(figsize=(8, 5))
sns.barplot(x='Source', y='Average Response Time (ms)', data=df, palette='Set2')
plt.title('Average Response Time by Source')
plt.ylabel('Average Response Time (ms)')
plt.xlabel('Source')
plt.grid(axis='y')
plt.tight_layout()
plt.show()

# === Box Plot: Min/Max Response Time Visualization ===
plt.figure(figsize=(8, 5))
sns.boxplot(data=[df['Min Response Time (ms)'], df['Max Response Time (ms)']], palette='Set3')
plt.xticks([0, 1], ['Min Response Time (ms)', 'Max Response Time (ms)'])
plt.title('Min vs Max Response Times')
plt.grid(axis='y')
plt.tight_layout()
plt.show()

# === Summary Table Plot ===
fig, ax = plt.subplots(figsize=(8, 2))
ax.axis('off')
table = ax.table(
    cellText=df.values,
    colLabels=df.columns,
    loc='center',
    cellLoc='center'
)
table.scale(1, 1.5)
plt.title('Summary Statistics', fontsize=14, weight='bold')
plt.tight_layout()
plt.show()
