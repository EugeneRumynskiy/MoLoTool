from math import floor
import random


def search(a, score):
    left = 0
    right = len(a) - 1
    mid = 0
    if (len(a) == 0) or (score < a[0]):
        return 0
    if (score >= a[-1]):
        return len(a) - 1
    
    while (left < right): 
        mid = int(floor((left + right) / 2))
        
        if (score >= a[mid]): 
            left = mid
        else:
            right = mid
        if (left + 1 == right):
            return left
        
            
    return left

def trivial(a, score):
    if (len(a) == 0) or (score < a[0]):
        return 0
         
    for i in range(len(a) - 1):
        if (a[i] <= score) and (a[i + 1] > score):            
            return i
    return i + 1

def test():           
    for g in range(100):
        b = []
        for i in range(1000):
            b.append(random.uniform(1, 2))
        b.sort()
        c = random.uniform(1, 1000)
        if(trivial(b, c) != search(b, c)):
            print(b, c, trivial(b, c), search(b, c))

    



