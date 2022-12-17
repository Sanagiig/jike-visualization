import "@/styles/reset.css"
import {hierarchy, pack} from "d3"

import data from "./data.json"

function draw(
  parent: SVGElement,
  node: any,
  {
    fillStyle = 'rgba(0, 0, 0, 0.2)',
    textColor = 'white'
  }: StyleInfo = {}) {

  const children = node.children;
  const {x, y, r} = node;
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', x);
  circle.setAttribute('cy', y);
  circle.setAttribute('r', r);
  circle.setAttribute('fill', fillStyle);
  circle.setAttribute('data-name', node.data.name);
  parent.appendChild(circle);
  if (children) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    for (let i = 0; i < children.length; i++) {
      draw(group, children[i], {fillStyle, textColor});
    }
    group.setAttribute('data-name', node.data.name);
    parent.appendChild(group);
  } else {
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('fill', textColor);
    text.setAttribute('font-family', 'Arial');
    text.setAttribute('font-size', '1.5rem');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('x', x);
    text.setAttribute('y', y);
    const name = node.data.name;
    text.textContent = name;
    parent.appendChild(text);
  }
}

const titleEl = document.getElementById('title')!;

function getTitle(target:HTMLElement) {
  const name = target.getAttribute('data-name');
  if (target.parentNode && target.parentNode.nodeName === 'g') {
    // @ts-ignore
    const parentName = target.parentNode!.getAttribute!('data-name');
    return `${parentName}-${name}`;
  }
  return name;
}

const svgroot = document.querySelector("svg")!
const regions = hierarchy(data).sum(() => 1)
  .sort((a: any, b: any) => b.value - a.value);

const p = pack()
  .size([1600, 1600])
  .padding(3);
const root = p(regions);

draw(svgroot, root);
let activeTarget: any = null;
svgroot.addEventListener('mousemove', (evt) => {
  let target = evt.target as any;
  if (target.nodeName === 'text') target = target.previousSibling!;
  if (activeTarget !== target) {
    if (activeTarget) activeTarget.setAttribute('fill', 'rgba(0, 0, 0, 0.2)');
  }
  target.setAttribute('fill', 'rgba(0, 128, 0, 0.1)');
  titleEl.textContent = getTitle(target);
  activeTarget = target;
});