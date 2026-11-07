import csv
from functools import cache
from collections import Counter
from itertools import combinations
def pair_counts(cols, rows):
    n = cols*rows
    adjacent = [[j for j in range(n) if abs(i%cols-j%cols) + abs(i//cols-j//cols)==1] for i in range(n)]
    observed = Counter()
    def walk(start, path):
        if len(path)==n:
            observed[start,path[-1]]+=1
            return
        for neighbor in adjacent[path[-1]]:
            if neighbor not in path:
                walk(start,path+[neighbor])
    for i in range(n):
        walk(i,[i])
    label=lambda i: chr(65+i%cols)+str(1+i//cols)
    data=[]
    for start,end in combinations(range(n),2):
        @cache
        def count(mask, last):
            if last == start:
                return int(mask == (1<<start))
            reduced=mask^(1<<last)
            return sum(count(reduced, previous) for previous in adjacent[last] if reduced & (1<<previous))
        value=count((1<<n)-1,end)
        assert value == observed[start,end] == observed[end,start]
        data.append((cols,rows,label(start),label(end),value))
    return data
with open('endpoint-path-counts.csv','w',newline='') as f:
    writer=csv.writer(f);writer.writerow(['columns','rows','start','end','complete_paths'])
    for cols,rows in [(3,3),(4,3),(3,2)]:
        data=pair_counts(cols,rows);writer.writerows(data)
        print(cols,rows,len(data),sum(row[-1]>0 for row in data),sum(row[-1] for row in data),max(row[-1] for row in data),data[0],next(row for row in data if row[2]=='A1' and row[3]==('C3' if rows==3 else 'C2')))
