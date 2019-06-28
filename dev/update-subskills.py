#!/usr/bin/env python3

# This script updates the links in the tree to include subskills

import os
import fnmatch
import re

if not os.path.isdir("skill-tree"):
  print("Error: run in the top level directory")
  exit(1)


matches = []
for root, dirnames, filenames in os.walk('skill-tree'):
  for filename in fnmatch.filter(filenames, '*.txt'):
    matches.append((root, filename))

# Generate subskill list
m = {}
for x in matches:
  if x[0] in m:
    m[x[0]].append(x[1])
  else:
    m[x[0]] = [x[1]]

tree = {}
for x in matches:
  d = os.path.dirname(x[0])
  if d in tree:
    tree[d].append(x[0])
  else:
    tree[d] = [x[0]]

# def getChilds(m, txt)

for parent in tree:
  childs = sorted(set(tree[parent]))

  if not parent in m:
    continue
  for txt in m[parent]:
    # find all children of the same skill level
    fd = open(parent + "/" + txt, "r")
    data = fd.read()
    fd.close()
    if data.find("# Subskills") != -1:
      pos = data.find("# Subskills")
      head = data[0:(pos + len("# Subskills"))]
      rest = data[len(head):].strip("\n")
      for c in reversed(childs):
        link = "[[%s:%s]]" % (c.replace("/", ":"), txt[0])
        if rest.find(link) == -1:
          rest = "  * %s\n%s" % (link, rest)
      data = head + "\n" + rest
    else:
      data = data + "\n# Subskills"
      for c in childs:
        data = data + "\n  * [[%s:%s]]" % (c.replace("/", ":"), txt[0])
    fd = open(parent + "/" + txt, "w")
    fd.write(data)
    fd.close()
