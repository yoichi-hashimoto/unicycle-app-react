import { useLayoutEffect, useRef, useState } from "react";
import type { SkillType } from "../common/type/skill";
import SkillCard from "../common/cards/SkillCard";
import { roadmapGenres, sortRoadmapSkills } from "../../features/roadmap/catalog";
import classes from "./SkillRoadmap.module.css";

type LaneProps = {
  skills: SkillType[];
  label: string;
  focusId?: number | "free";
  basic?: boolean;
  onTargetSelected: (user: any) => Promise<void>;
};

export function SkillLane({ skills, label, focusId, basic = false, onTargetSelected }: LaneProps) {
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const [paths, setPaths] = useState("");
  const signature = skills.map(skill => `${skill.id}:${(skill.prerequisite_ids ?? []).join(",")}`).join("|");
  const centerCurrent = () => {
    const container = viewport.current;
    if (container && !basic && focusId === undefined) { container.scrollLeft = 0; return; }
    const node = track.current?.querySelector<HTMLElement>(`[data-skill-id="${focusId ?? skills.find(skill => !skill.is_cleared)?.id ?? skills[0]?.id}"]`);
    if (!container || !node) return;
    const outer = container.getBoundingClientRect();
    const inner = node.getBoundingClientRect();
    const left = Math.max(0, container.scrollLeft + inner.left - outer.left + inner.width / 2 - outer.width / 2);
    if (container.scrollTo) container.scrollTo({ left, behavior: "auto" }); else container.scrollLeft = left;
  };
  useLayoutEffect(() => {
    const container = viewport.current, list = track.current;
    if (!container || !list) return;
    const layout = () => {
      const first = list.querySelector<HTMLElement>("[data-skill-id]");
      const width = first?.getBoundingClientRect().width || 190;
      list.style.setProperty("--roadmap-edge", `${basic || focusId !== undefined ? Math.max(16, (container.clientWidth - width) / 2) : 16}px`);
      if (!basic) {
        const bounds = list.getBoundingClientRect();
        const nodes = new Map<number, DOMRect>();
        list.querySelectorAll<HTMLElement>("[data-skill-id]").forEach(node => nodes.set(Number(node.dataset.skillId), node.getBoundingClientRect()));
        const edges: string[] = [];
        const childCounts = new Map<number, number>();
        skills.forEach(skill => skill.prerequisite_ids?.forEach(id => childCounts.set(id, (childCounts.get(id) ?? 0) + 1)));
        skills.forEach(skill => skill.prerequisite_ids?.forEach(parentId => {
          const parent = nodes.get(parentId), child = nodes.get(skill.id);
          if (!parent || !child) return;
          if (childCounts.get(parentId) === 1 && Math.abs(child.left - parent.right) <= 40 && child.left >= parent.right) {
            edges.push(`M ${parent.right - bounds.left} ${parent.top + parent.height / 2 - bounds.top} H ${child.left - bounds.left}`);
          } else {
            const bottom = Math.max(parent.bottom, child.bottom) - bounds.top + 15;
            edges.push(`M ${parent.left + parent.width / 2 - bounds.left} ${parent.bottom - bounds.top} V ${bottom} H ${child.left + child.width / 2 - bounds.left} V ${child.bottom - bounds.top}`);
          }
        }));
        setPaths(edges.join(" "));
      }
      centerCurrent();
    };
    layout();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(layout);
    observer?.observe(container);
    return () => observer?.disconnect();
    // The layout depends on node identity/edges and the selected goal, not comment updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature, focusId, basic]);

  const move = (direction: number) => {
    const container = viewport.current;
    if (container?.scrollBy) container.scrollBy({ left: direction * Math.max(190, container.clientWidth * .65), behavior: "smooth" });
  };
  return <div className={classes.lane}>
    <div className={classes.laneControls} role="group" aria-label={`${label}の移動`}>
      <button type="button" onClick={() => move(-1)} aria-label={`${label}を前へ`}>← 前へ</button>
      <button type="button" onClick={centerCurrent}>{label}の{!basic && focusId === undefined ? "先頭" : "現在地"}へ</button>
      <button type="button" onClick={() => move(1)} aria-label={`${label}を先へ`}>先へ →</button>
    </div>
    <div className={classes.viewport} ref={viewport} aria-label={`${label}の道`}>
      <ol className={`${classes.track} ${basic ? classes.basicTrack : ""}`} ref={track}>
        {!basic && <svg className={classes.connections} aria-hidden="true"><path d={paths} /></svg>}
        {skills.map(skill => <li key={skill.id} className={classes.node} data-skill-id={skill.id}>
          {skill.is_current && <span className={classes.currentMarker}>いまここ</span>}
          <SkillCard skill={skill} variant="roadmap" onTargetSelected={onTargetSelected} />
        </li>)}
        {basic && <li className={classes.node} data-skill-id="free">
          {focusId === "free" && <span className={classes.currentMarker}>いまここ</span>}
          <button type="button" className={`${classes.hub} ${focusId === "free" ? classes.activeHub : ""}`}
            onClick={() => document.getElementById("skill-genre-title")?.scrollIntoView({ behavior: "smooth", block: "start" })}>
            <span>Lv26〜</span><strong>好きな道へ</strong><span>6ジャンルから選ぶ</span>
          </button>
        </li>}
      </ol>
    </div>
  </div>;
}

export function GenreFork({ skills, selected, onSelect }: { skills: SkillType[]; selected: string; onSelect: (name: string) => void }) {
  const map = useRef<HTMLElement>(null);
  const fork = useRef<HTMLDivElement>(null);
  const [paths, setPaths] = useState("");
  const genres = [...roadmapGenres, ...Array.from(new Set(skills.map(skill => skill.category))).filter(name => !roadmapGenres.some(genre => genre.name === name)).map(name => ({ name, description: "ジャンルの技を選ぶ" }))];
  useLayoutEffect(() => {
    const root = map.current, hub = fork.current;
    if (!root || !hub) return;
    const layout = () => {
      const outer = root.getBoundingClientRect(), start = hub.getBoundingClientRect();
      const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>("button"));
      if (!buttons.length || !outer.width) return;
      const first = buttons[0].getBoundingClientRect(), x = start.right - outer.left, y = start.top + start.height / 2 - outer.top, bus = x + Math.max(10, (first.left - start.right) / 2);
      setPaths(buttons.map(button => {
        const box = button.getBoundingClientRect(), endX = box.left - outer.left, endY = box.top + box.height / 2 - outer.top;
        return box.left > first.left + 5
          ? `M ${x} ${y} H ${bus} V 4 H ${(first.right + box.left) / 2 - outer.left} V ${endY} H ${endX}`
          : `M ${x} ${y} H ${bus} V ${endY} H ${endX}`;
      }).join(" "));
    };
    layout();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(layout);
    observer?.observe(root);
    return () => observer?.disconnect();
  }, [skills]);
  return <nav className={classes.genreMap} ref={map} aria-label="自由コースのジャンル">
    <svg className={classes.genreConnections} aria-hidden="true"><path d={paths} /></svg>
    <div className={classes.fork} ref={fork}><span>基礎ゴール</span><strong>Lv25</strong><span>横乗りクリア</span></div>
    <div className={classes.genreGrid}>{genres.map(genre => <button type="button" className={classes.genreButton} key={genre.name}
      aria-pressed={selected === genre.name} onClick={() => onSelect(genre.name)}>
      <span><strong>{genre.name}</strong><small>{genre.description}</small></span>
      <span>{skills.filter(skill => skill.category === genre.name).length}技 →</span>
    </button>)}</div>
  </nav>;
}

export function GenreLane({ skills, genre, onTargetSelected }: { skills: SkillType[]; genre: string; onTargetSelected: (user: any) => Promise<void> }) {
  const selected = skills.filter(skill => skill.category === genre).sort(sortRoadmapSkills);
  return <section className={classes.genreDetail} aria-label={`${genre}の技`}>
    <h3>{genre} <small>{selected.length}技</small></h3>
    {selected.length ? <SkillLane skills={selected} label={genre} focusId={selected.find(skill => skill.is_current)?.id} onTargetSelected={onTargetSelected} /> : <p>このジャンルの技はまだありません。</p>}
  </section>;
}
