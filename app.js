(function () {
  "use strict";
  const U = Pandao,
    B = Business;
  const app = U.mount({
    title: "会议与任务整理工具",
    icon: "✓",
    category: "团队协作",
    description: "从会议文字中提取行动项，编辑负责人、日期和状态，导出任务表。",
    repo: "https://github.com/tianchaodaxing-beep/pandao-meeting",
  });
  const example =
    "会议日期：2026-09-30\n张三负责明天完成报价单。\n负责人：李四，请在2026-10-05提交库存盘点。\n请整理客户反馈，负责人：王五，截止下周五。\n本次讨论涉及采购周期和报价有效期。";
  const p = U.panel("会议内容");
  const date = U.field("会议日期", "meeting-date", "2026-09-30", "date"),
    text = U.field("会议文字", "transcript", example, "textarea");
  text.input.style.minHeight = "320px";
  p.append(
    date.wrap,
    U.h("div", { class: "divider" }),
    text.wrap,
    U.fileInput(
      "读取文字文件",
      async (f) => {
        if (f.size > 2 * 1024 * 1024) throw Error("请选择小于2 MB的文字文件");
        text.input.value = await f.text();
        U.source("文件：" + f.name);
      },
      false,
      ".txt,.md",
    ),
    U.actions(
      U.button("整理行动项", U.run(extract), true),
      U.button("读取演示", () => {
        text.input.value = example;
        date.input.value = "2026-09-30";
        extract();
        U.source("演示数据");
      }),
    ),
  );
  app.input.append(p);
  const out = U.panel("任务清单");
  app.output.append(out);
  let tasks = [];
  function extract() {
    if (!date.input.value) throw Error("请选择会议日期");
    tasks = B.tasks(text.input.value, date.input.value);
    draw();
    U.source("会议：" + date.input.value);
    U.notice("已整理 " + tasks.length + " 个行动项，请核对后导出。");
  }
  function draw() {
    U.clear(out).append(
      U.h("div", { class: "panel-heading" }, [
        U.h("h2", { text: "任务清单" }),
        U.h("span", { class: "tag", text: tasks.length + "项" }),
      ]),
    );
    if (!tasks.length)
      out.append(
        U.h("p", {
          class: "empty",
          text: "没有识别到行动项。可以手动添加任务。",
        }),
      );
    for (const [index, t] of tasks.entries()) {
      const box = U.h("div", { class: "task-editor" }),
        title = U.field("任务内容", "task-" + index, t.task, "textarea"),
        grid = U.h("div", { class: "grid" });
      title.input.style.minHeight = "75px";
      title.input.addEventListener("input", () => (t.task = title.input.value));
      for (const [label, key, type] of [
        ["负责人", "owner", "text"],
        ["截止日期", "due", "date"],
        ["日期原文", "deadlineText", "text"],
        ["状态", "status", "text"],
      ]) {
        const f = U.field(
          label,
          key + "-" + index,
          t[key],
          type,
          key === "status" ? ["待处理", "进行中", "已完成"] : null,
        );
        f.input.addEventListener("input", () => (t[key] = f.input.value));
        grid.append(f.wrap);
      }
      box.append(
        title.wrap,
        grid,
        U.h("p", {
          class: "original",
          text: "原文：" + (t.source || "手动添加"),
        }),
        U.actions(
          U.button("移除任务", () => {
            tasks.splice(index, 1);
            draw();
          }),
        ),
      );
      out.append(box);
    }
    out.append(
      U.actions(
        U.button("添加任务", () => {
          tasks.push({
            task: "",
            owner: "",
            due: "",
            deadlineText: "",
            status: "待处理",
            source: "",
          });
          draw();
        }),
        U.button(
          "导出任务表",
          U.run(() => {
            validate();
            U.exportRows("会议任务.xlsx", rows());
          }),
          true,
        ),
        U.button(
          "导出文字清单",
          U.run(() => {
            validate();
            U.download(
              "会议任务.md",
              "# 会议任务\n\n会议日期：" +
                date.input.value +
                "\n\n" +
                tasks
                  .map(
                    (t) =>
                      "- [" +
                      (t.status === "已完成" ? "x" : " ") +
                      "] " +
                      t.task +
                      "\n  负责人：" +
                      (t.owner || "未填写") +
                      "；截止日期：" +
                      (t.due || t.deadlineText || "未填写") +
                      "；状态：" +
                      t.status +
                      "\n  原文：" +
                      t.source,
                  )
                  .join("\n\n"),
            );
          }),
        ),
      ),
    );
  }
  function validate() {
    if (!tasks.length) throw Error("请先整理或添加任务");
    if (tasks.some((t) => !t.task.trim())) throw Error("请填写所有任务内容");
  }
  function rows() {
    return tasks.map((t) => ({
      会议日期: date.input.value,
      任务: t.task,
      负责人: t.owner,
      截止日期: t.due,
      日期原文: t.deadlineText,
      状态: t.status,
      来源原文: t.source,
    }));
  }
  extract();
  U.source("演示数据");
})();
