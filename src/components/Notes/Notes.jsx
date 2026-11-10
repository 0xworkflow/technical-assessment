import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "../Button/Button";
import { smoothScrollTo } from "../../utils/smoothScroll";
import { ErrorState } from "../Feedback/AsyncStates";

const notesApi = axios.create({ baseURL: "http://localhost:5001" });

const getErrorMessage = (requestError, fallback) =>
  requestError.response?.data?.message || requestError.message || fallback;

const downloadTextFile = (filename, content, type) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const REQUIRED_ENDPOINTS = [
  "POST /notes",
  "GET /notes",
  "GET /notes/:id",
  "PUT /notes/:id",
  "DELETE /notes/:id",
];

const baseBtn =
  "h-11 rounded-xl px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-80";
const primaryBtn = `${baseBtn} bg-gradient-to-r from-sky-600 via-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-400/30 hover:brightness-110`;
const dangerBtn = `${baseBtn} bg-gradient-to-r from-rose-600 to-red-700 text-white shadow-md shadow-rose-400/30 hover:brightness-110`;
const ghostBtn =
  "h-[37px] rounded-lg border border-slate-300 bg-white px-3 text-[13px] font-medium text-slate-700 shadow-sm hover:bg-slate-100 dark:border-[#2a2a2a] dark:bg-[#111111] dark:text-slate-100 dark:hover:bg-[#171717]";
const toggleBtn = "h-[37px] px-3 text-[13px] font-medium transition";
const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-[15px] text-slate-800 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400 dark:border-[#2a2a2a] dark:bg-[#111111] dark:text-slate-100 dark:placeholder:text-slate-400";
const responseShellClass =
  "mt-auto rounded-xl border border-slate-200 bg-slate-50 p-2.5 shadow-inner dark:border-[#2a2a2a] dark:bg-[#111111]";
const panelClass =
  "flex min-h-[320px] flex-col gap-2.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_12px_28px_rgba(15,23,42,0.08)] dark:border-[#2a2a2a] dark:bg-[#0b0b0b] dark:text-slate-100";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [viewMode, setViewMode] = useState("cards");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [activity, setActivity] = useState([]);
  const [latestResponse, setLatestResponse] = useState(null);
  const [notesFetchError, setNotesFetchError] = useState("");

  const [validationErrors, setValidationErrors] = useState({
    post: {},
    getOne: {},
    put: {},
    delete: {},
  });

  const [postForm, setPostForm] = useState({ title: "", content: "" });
  const [getOneId, setGetOneId] = useState("");
  const [putForm, setPutForm] = useState({ id: "", title: "", content: "" });
  const [deleteId, setDeleteId] = useState("");

  const [responses, setResponses] = useState({
    post: null,
    getAll: null,
    getOne: null,
    put: null,
    delete: null,
  });

  const [loading, setLoading] = useState({
    post: false,
    getAll: false,
    getOne: false,
    put: false,
    delete: false,
  });

  const sortedNotes = [...notes].sort((a, b) => Number(b.id) - Number(a.id));

  const formatDateTime = (value) => {
    if (!value) {
      return "N/A";
    }
    return new Date(value).toLocaleString();
  };

  const setCallLoading = (key, value) => {
    setLoading((prev) => ({ ...prev, [key]: value }));
  };

  const withValidationClass = (hasError) =>
    `${inputClass} ${
      hasError ? "border-rose-400 ring-2 ring-rose-200 focus:border-rose-500 focus:ring-rose-300" : ""
    }`;

  const setFormValidationErrors = (form, errors) => {
    setValidationErrors((prev) => ({
      ...prev,
      [form]: errors,
    }));
  };

  const clearFieldValidationError = (form, field) => {
    setValidationErrors((prev) => {
      if (!prev[form]?.[field]) {
        return prev;
      }
      return {
        ...prev,
        [form]: {
          ...prev[form],
          [field]: "",
        },
      };
    });
  };

  const resetAlerts = () => {
    setMessage("");
    setError("");
  };

  const addActivity = (method, path, status, info = "") => {
    const entry = {
      id: Date.now() + Math.random(),
      method,
      path,
      status,
      info,
      at: new Date().toISOString(),
    };
    setActivity((prev) => [entry, ...prev].slice(0, 20));
  };

  const setCallResponse = (key, endpoint, status, data) => {
    const payload = {
      endpoint,
      status,
      data,
      at: new Date().toISOString(),
    };
    setResponses((prev) => ({ ...prev, [key]: payload }));
    setLatestResponse(payload);
  };

  const fetchNotes = async (silent = true) => {
    setCallLoading("getAll", true);
    try {
      const response = await notesApi.get("/notes");
      const data = Array.isArray(response.data) ? response.data : [];
      setNotes(data);
      setNotesFetchError("");
      setCallResponse("getAll", "GET /notes", response.status, data);
      addActivity("GET", "/notes", response.status, `${data.length} notes`);
      if (!silent) {
        setMessage("Fetched all notes.");
      }
    } catch (requestError) {
      const status = requestError.response?.status || "ERR";
      const info = getErrorMessage(requestError, "Unable to fetch notes.");
      setNotesFetchError(info);
      setCallResponse(
        "getAll",
        "GET /notes",
        status,
        requestError.response?.data || { message: info }
      );
      addActivity("GET", "/notes", status, info);
      if (!silent) {
        setError(info);
      }
    } finally {
      setCallLoading("getAll", false);
    }
  };

  useEffect(() => {
    fetchNotes(true);
  }, []);

  useEffect(() => {
    if (!message && !error) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setMessage("");
      setError("");
    }, 2800);

    return () => clearTimeout(timer);
  }, [message, error]);

  const handlePostCreate = async (event) => {
    event.preventDefault();
    resetAlerts();
    const nextErrors = {};
    if (!postForm.title.trim()) {
      nextErrors.title = "Title is required.";
    }
    if (!postForm.content.trim()) {
      nextErrors.content = "Content is required.";
    }
    setFormValidationErrors("post", nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setError("Fix validation errors in POST /notes.");
      return;
    }

    setCallLoading("post", true);
    try {
      const response = await notesApi.post("/notes", {
        title: postForm.title.trim(),
        content: postForm.content.trim(),
      });
      setCallResponse("post", "POST /notes", response.status, response.data);
      addActivity("POST", "/notes", response.status, response.data.title);
      setPostForm({ title: "", content: "" });
      setMessage(`Created note #${response.data.id}.`);
      await fetchNotes(true);
    } catch (requestError) {
      const status = requestError.response?.status || "ERR";
      const info = getErrorMessage(requestError, "Unable to create note.");
      setCallResponse("post", "POST /notes", status, requestError.response?.data || { message: info });
      addActivity("POST", "/notes", status, info);
      setError(info);
    } finally {
      setCallLoading("post", false);
    }
  };

  const handleGetById = async (event) => {
    event.preventDefault();
    resetAlerts();
    const nextErrors = {};
    if (!getOneId.trim()) {
      nextErrors.id = "Enter a note ID.";
    }
    setFormValidationErrors("getOne", nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setError("Fix validation errors in GET /notes/:id.");
      return;
    }

    setCallLoading("getOne", true);
    const id = getOneId.trim();
    try {
      const response = await notesApi.get(`/notes/${encodeURIComponent(id)}`);
      setCallResponse("getOne", `GET /notes/${id}`, response.status, response.data);
      addActivity("GET", `/notes/${id}`, response.status, response.data.title);
      setMessage(`Fetched note #${response.data.id}.`);
    } catch (requestError) {
      const status = requestError.response?.status || "ERR";
      const info = getErrorMessage(requestError, "Unable to fetch note.");
      setCallResponse(
        "getOne",
        `GET /notes/${id}`,
        status,
        requestError.response?.data || { message: info }
      );
      addActivity("GET", `/notes/${id}`, status, info);
      setError(info);
    } finally {
      setCallLoading("getOne", false);
    }
  };

  const handlePutUpdate = async (event) => {
    event.preventDefault();
    resetAlerts();
    const nextErrors = {};
    if (!putForm.id.trim()) {
      nextErrors.id = "ID is required.";
    }
    if (!putForm.title.trim()) {
      nextErrors.title = "Updated title is required.";
    }
    if (!putForm.content.trim()) {
      nextErrors.content = "Updated content is required.";
    }
    setFormValidationErrors("put", nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setError("Fix validation errors in PUT /notes/:id.");
      return;
    }

    setCallLoading("put", true);
    const id = putForm.id.trim();
    try {
      const response = await notesApi.put(`/notes/${encodeURIComponent(id)}`, {
        title: putForm.title.trim(),
        content: putForm.content.trim(),
      });
      setCallResponse("put", `PUT /notes/${id}`, response.status, response.data);
      addActivity("PUT", `/notes/${id}`, response.status, response.data.title);
      setMessage(`Updated note #${response.data.id}.`);
      await fetchNotes(true);
    } catch (requestError) {
      const status = requestError.response?.status || "ERR";
      const info = getErrorMessage(requestError, "Unable to update note.");
      setCallResponse(
        "put",
        `PUT /notes/${id}`,
        status,
        requestError.response?.data || { message: info }
      );
      addActivity("PUT", `/notes/${id}`, status, info);
      setError(info);
    } finally {
      setCallLoading("put", false);
    }
  };

  const deleteNoteById = async (id, fromCard = false) => {
    resetAlerts();
    const nextErrors = {};
    if (!id.trim()) {
      nextErrors.id = "ID is required.";
    }
    if (!fromCard) {
      setFormValidationErrors("delete", nextErrors);
    }
    if (Object.keys(nextErrors).length > 0) {
      setError("Fix validation errors in DELETE /notes/:id.");
      return;
    }

    setCallLoading("delete", true);
    const noteId = id.trim();
    try {
      const response = await notesApi.delete(`/notes/${encodeURIComponent(noteId)}`);
      setCallResponse("delete", `DELETE /notes/${noteId}`, response.status, {
        message: "Note deleted.",
      });
      addActivity("DELETE", `/notes/${noteId}`, response.status, "Deleted");
      if (!fromCard) {
        setDeleteId("");
      }
      setMessage(`Deleted note #${noteId}.`);
      await fetchNotes(true);
    } catch (requestError) {
      const status = requestError.response?.status || "ERR";
      const info = getErrorMessage(requestError, "Unable to delete note.");
      setCallResponse(
        "delete",
        `DELETE /notes/${noteId}`,
        status,
        requestError.response?.data || { message: info }
      );
      addActivity("DELETE", `/notes/${noteId}`, status, info);
      setError(info);
    } finally {
      setCallLoading("delete", false);
    }
  };

  const handleDeleteById = async (event) => {
    event.preventDefault();
    await deleteNoteById(deleteId, false);
  };

  const loadIntoPutForm = (note) => {
    setPutForm({ id: note.id, title: note.title, content: note.content });
    setFormValidationErrors("put", {});
    setGetOneId(note.id);
    setMessage(`Loaded note #${note.id} into PUT form.`);
    setError("");
    smoothScrollTo(0);
  };


  const exportLogsJson = () => {
    downloadTextFile(
      "notes-activity.json",
      JSON.stringify(activity, null, 2),
      "application/json"
    );
  };

  const exportLogsText = () => {
    const lines = activity.map(
      (item) =>
        `${formatDateTime(item.at)} | ${item.method} ${item.path} | ${item.status} | ${item.info || ""}`
    );
    const output = lines.length > 0 ? lines.join("\n") : "No activity captured yet.";
    downloadTextFile("notes-activity.txt", output, "text/plain");
  };

  const renderResponsePanel = (key, emptyText) => {
    const current = responses[key];

    if (loading[key]) {
      return (
        <div className={responseShellClass}>
          <div className="h-2.5 w-4/5 animate-pulse rounded bg-slate-200" />
          <div className="mt-2 h-2.5 w-[95%] animate-pulse rounded bg-slate-200" />
          <div className="mt-2 h-2.5 w-[70%] animate-pulse rounded bg-slate-200" />
        </div>
      );
    }

    if (!current) {
      return (
        <div className={responseShellClass}>
          <p className="text-sm text-slate-500">{emptyText}</p>
        </div>
      );
    }

    return (
      <div className={responseShellClass}>
        <div className="mb-2 flex items-center justify-between gap-2 text-[13px] text-slate-700 dark:text-slate-200">
          <span>{current.endpoint}</span>
          <span>
            {current.status} | {formatDateTime(current.at)}
          </span>
        </div>
        <pre className="max-h-[180px] overflow-auto text-xs leading-5 text-slate-800 dark:text-slate-100">
          {JSON.stringify(current.data, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <section
      id="notesPage"
      className="w-full pb-20 pt-2 [&_*]:!rounded-none"
    >
      <div className="w-full px-4 md:px-8">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-4 dark:border-[#222] md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="mb-2 text-left font-['Rufina'] text-[48px] leading-none text-[#181d24] dark:text-white md:text-[56px]">
              Notes API Playground
            </h2>
            <p className="max-w-[720px] text-[17px] text-slate-600 dark:text-slate-300">
              Dedicated testers for every required endpoint with live payload output.
            </p>
          </div>
          <div className="flex gap-2">
            <div className="min-w-[125px] rounded-[14px] border border-slate-200 bg-slate-100 px-3 py-2 text-right dark:border-[#2a2a2a] dark:bg-[#111111]">
              <span className="text-[13px] text-slate-600 dark:text-slate-300">Total Notes</span>
              <strong className="block text-[30px] leading-none text-slate-900 dark:text-white">{notes.length}</strong>
            </div>
            <div className="min-w-[125px] rounded-[14px] border border-amber-200 bg-amber-50 px-3 py-2 text-right dark:border-[#2a2a2a] dark:bg-[#111111]">
              <span className="text-[13px] text-amber-700 dark:text-slate-300">View</span>
              <strong className="block text-[22px] leading-none text-amber-900 dark:text-white">
                {viewMode === "cards" ? "Cards" : "Table"}
              </strong>
            </div>
          </div>
        </header>

        <div className="mt-4 flex flex-wrap gap-2">
          {REQUIRED_ENDPOINTS.map((item) => (
            <span
              key={item}
              className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 text-[13px] text-slate-700 dark:border-[#2a2a2a] dark:bg-[#111111] dark:text-slate-200"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="pointer-events-none fixed right-[18px] top-[92px] z-[1200] flex max-w-[420px] flex-col gap-2 md:max-w-[420px]">
          {message ? (
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-700 shadow-lg">
              {message}
            </p>
          ) : null}
          {error ? (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-700 shadow-lg">
              {error}
            </p>
          ) : null}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
          <article className={panelClass}>
            <div className="flex flex-col gap-1">
              <span className="inline-flex w-fit rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                POST /notes
              </span>
              <h5 className="text-left font-['Rufina'] text-[46px] leading-none text-[#111] dark:text-white">Create Note</h5>
            </div>
            <form className="flex flex-col gap-2" onSubmit={handlePostCreate}>
              <input
                className={withValidationClass(Boolean(validationErrors.post.title))}
                value={postForm.title}
                onChange={(event) => {
                  setPostForm((prev) => ({ ...prev, title: event.target.value }));
                  clearFieldValidationError("post", "title");
                }}
                placeholder="Title"
                required
                aria-invalid={Boolean(validationErrors.post.title)}
                aria-describedby={validationErrors.post.title ? "post-title-error" : undefined}
              />
              {validationErrors.post.title ? (
                <p id="post-title-error" className="text-xs text-rose-600">
                  {validationErrors.post.title}
                </p>
              ) : null}
              <textarea
                className={`${withValidationClass(Boolean(validationErrors.post.content))} min-h-[96px]`}
                value={postForm.content}
                onChange={(event) => {
                  setPostForm((prev) => ({ ...prev, content: event.target.value }));
                  clearFieldValidationError("post", "content");
                }}
                placeholder="Content"
                rows={4}
                required
                aria-invalid={Boolean(validationErrors.post.content)}
                aria-describedby={validationErrors.post.content ? "post-content-error" : undefined}
              />
              {validationErrors.post.content ? (
                <p id="post-content-error" className="text-xs text-rose-600">
                  {validationErrors.post.content}
                </p>
              ) : null}
              <Button
                type="submit"
                className={primaryBtn}
                loading={loading.post}
                aria-label="Run POST /notes to create a note"
              >
                Run POST
              </Button>
            </form>
            {renderResponsePanel("post", "POST response will appear here.")}
          </article>

          <article className={panelClass}>
            <div className="flex flex-col gap-1">
              <span className="inline-flex w-fit rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                GET /notes
              </span>
              <h5 className="text-left font-['Rufina'] text-[46px] leading-none text-[#111] dark:text-white">Fetch All Notes</h5>
            </div>
            <p className="text-[15px] text-slate-600">Use this to refresh data and verify collection-level read.</p>
            <Button
              type="button"
              className={primaryBtn}
              loading={loading.getAll}
              aria-label="Run GET /notes to fetch all notes"
              onClick={() => {
                resetAlerts();
                fetchNotes(false);
              }}
            >
              Run GET All
            </Button>
            {renderResponsePanel("getAll", "GET /notes response will appear here.")}
          </article>

          <article className={panelClass}>
            <div className="flex flex-col gap-1">
              <span className="inline-flex w-fit rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                GET /notes/:id
              </span>
              <h5 className="text-left font-['Rufina'] text-[46px] leading-none text-[#111] dark:text-white">Fetch Single Note</h5>
            </div>
            <form className="flex flex-col gap-2" onSubmit={handleGetById}>
              <input
                className={withValidationClass(Boolean(validationErrors.getOne.id))}
                value={getOneId}
                onChange={(event) => {
                  setGetOneId(event.target.value);
                  clearFieldValidationError("getOne", "id");
                }}
                placeholder="Note ID"
                required
                aria-invalid={Boolean(validationErrors.getOne.id)}
                aria-describedby={validationErrors.getOne.id ? "get-id-error" : undefined}
              />
              {validationErrors.getOne.id ? (
                <p id="get-id-error" className="text-xs text-rose-600">
                  {validationErrors.getOne.id}
                </p>
              ) : null}
              <Button
                type="submit"
                className={primaryBtn}
                loading={loading.getOne}
                aria-label="Run GET /notes by note ID"
              >
                Run GET by ID
              </Button>
            </form>
            {renderResponsePanel("getOne", "GET /notes/:id response will appear here.")}
          </article>

          <article className={panelClass}>
            <div className="flex flex-col gap-1">
              <span className="inline-flex w-fit rounded-full bg-violet-100 px-2.5 py-1 text-[11px] font-semibold text-violet-700">
                PUT /notes/:id
              </span>
              <h5 className="text-left font-['Rufina'] text-[46px] leading-none text-[#111] dark:text-white">Update Note</h5>
            </div>
            <form className="flex flex-col gap-2" onSubmit={handlePutUpdate}>
              <input
                className={withValidationClass(Boolean(validationErrors.put.id))}
                value={putForm.id}
                onChange={(event) => {
                  setPutForm((prev) => ({ ...prev, id: event.target.value }));
                  clearFieldValidationError("put", "id");
                }}
                placeholder="Note ID"
                required
                aria-invalid={Boolean(validationErrors.put.id)}
                aria-describedby={validationErrors.put.id ? "put-id-error" : undefined}
              />
              {validationErrors.put.id ? (
                <p id="put-id-error" className="text-xs text-rose-600">
                  {validationErrors.put.id}
                </p>
              ) : null}
              <input
                className={withValidationClass(Boolean(validationErrors.put.title))}
                value={putForm.title}
                onChange={(event) => {
                  setPutForm((prev) => ({ ...prev, title: event.target.value }));
                  clearFieldValidationError("put", "title");
                }}
                placeholder="Updated title"
                required
                aria-invalid={Boolean(validationErrors.put.title)}
                aria-describedby={validationErrors.put.title ? "put-title-error" : undefined}
              />
              {validationErrors.put.title ? (
                <p id="put-title-error" className="text-xs text-rose-600">
                  {validationErrors.put.title}
                </p>
              ) : null}
              <textarea
                className={`${withValidationClass(Boolean(validationErrors.put.content))} min-h-[96px]`}
                value={putForm.content}
                onChange={(event) => {
                  setPutForm((prev) => ({ ...prev, content: event.target.value }));
                  clearFieldValidationError("put", "content");
                }}
                placeholder="Updated content"
                rows={4}
                required
                aria-invalid={Boolean(validationErrors.put.content)}
                aria-describedby={validationErrors.put.content ? "put-content-error" : undefined}
              />
              {validationErrors.put.content ? (
                <p id="put-content-error" className="text-xs text-rose-600">
                  {validationErrors.put.content}
                </p>
              ) : null}
              <Button
                type="submit"
                className={primaryBtn}
                loading={loading.put}
                aria-label="Run PUT /notes by note ID to update note"
              >
                Run PUT
              </Button>
            </form>
            {renderResponsePanel("put", "PUT /notes/:id response will appear here.")}
          </article>

          <article className={panelClass}>
            <div className="flex flex-col gap-1">
              <span className="inline-flex w-fit rounded-full bg-rose-100 px-2.5 py-1 text-[11px] font-semibold text-rose-700">
                DELETE /notes/:id
              </span>
              <h5 className="text-left font-['Rufina'] text-[46px] leading-none text-[#111] dark:text-white">Delete Note</h5>
            </div>
            <form className="flex flex-col gap-2" onSubmit={handleDeleteById}>
              <input
                className={withValidationClass(Boolean(validationErrors.delete.id))}
                value={deleteId}
                onChange={(event) => {
                  setDeleteId(event.target.value);
                  clearFieldValidationError("delete", "id");
                }}
                placeholder="Note ID"
                required
                aria-invalid={Boolean(validationErrors.delete.id)}
                aria-describedby={validationErrors.delete.id ? "delete-id-error" : undefined}
              />
              {validationErrors.delete.id ? (
                <p id="delete-id-error" className="text-xs text-rose-600">
                  {validationErrors.delete.id}
                </p>
              ) : null}
              <Button
                type="submit"
                className={dangerBtn}
                loading={loading.delete}
                aria-label="Run DELETE /notes by note ID"
              >
                Run DELETE
              </Button>
            </form>
            {renderResponsePanel("delete", "DELETE /notes/:id response will appear here.")}
          </article>
        </div>

          <div className="mt-6 border-t border-slate-200 pt-4 dark:border-[#222]">
          <div className="mb-2 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h4 className="text-left font-['Rufina'] text-[52px] leading-none text-[#111] dark:text-white">Stored Notes</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300">{notes.length} item(s) in memory</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="inline-flex overflow-hidden rounded-lg border border-slate-300">
                <Button
                  type="button"
                  className={`${toggleBtn} ${viewMode === "cards" ? "bg-slate-700 text-white dark:bg-white dark:text-black" : "bg-slate-50 text-slate-700 dark:bg-[#111111] dark:text-slate-200"}`}
                  onClick={() => setViewMode("cards")}
                  aria-label="Switch notes display to cards view"
                >
                  Cards
                </Button>
                <Button
                  type="button"
                  className={`${toggleBtn} ${viewMode === "table" ? "bg-slate-700 text-white dark:bg-white dark:text-black" : "bg-slate-50 text-slate-700 dark:bg-[#111111] dark:text-slate-200"}`}
                  onClick={() => setViewMode("table")}
                  aria-label="Switch notes display to table view"
                >
                  Table
                </Button>
              </div>
              <Button
                type="button"
                className={ghostBtn}
                onClick={exportLogsJson}
                aria-label="Export request activity logs as JSON"
              >
                Export JSON Logs
              </Button>
              <Button
                type="button"
                className={ghostBtn}
                onClick={exportLogsText}
                aria-label="Export request activity logs as text file"
              >
                Export TXT Logs
              </Button>
            </div>
          </div>

          {loading.getAll ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-[#2a2a2a] dark:bg-[#111111]" key={`skeleton-${index}`}>
                  <div className="h-2.5 w-[35%] animate-pulse rounded bg-slate-200" />
                  <div className="mt-3 h-2.5 w-[85%] animate-pulse rounded bg-slate-200" />
                  <div className="mt-3 h-2.5 w-[70%] animate-pulse rounded bg-slate-200" />
                </div>
              ))}
            </div>
          ) : null}

          {!loading.getAll && notes.length === 0 ? (
            <>
              {notesFetchError ? (
                <ErrorState
                  title="Unable to fetch notes"
                  description={notesFetchError}
                  retryLabel="Retry GET /notes"
                  onRetry={() => fetchNotes(false)}
                />
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 dark:border-[#2a2a2a] dark:bg-[#111111]">
                  <h5 className="mb-1 text-left font-['Rufina'] text-[42px] leading-none text-[#111] dark:text-white">No notes yet</h5>
                  <p className="text-slate-600 dark:text-slate-300">Create one from the POST card above.</p>
                </div>
              )}
            </>
          ) : null}

          {!loading.getAll && notes.length > 0 && viewMode === "cards" ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {sortedNotes.map((note) => (
                <article
                  className="min-h-[185px] rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-1 hover:shadow-lg dark:border-[#2a2a2a] dark:bg-[#111111]"
                  key={note.id}
                >
                  <div className="mb-2 flex items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <span className="rounded-full border border-slate-300 bg-slate-100 px-2.5 py-1 text-xs text-slate-700 dark:border-[#2a2a2a] dark:bg-[#1a1a1a] dark:text-slate-200">
                      ID #{note.id}
                    </span>
                    <span>Updated: {formatDateTime(note.updatedAt)}</span>
                  </div>
                  <h5 className="mb-1 text-left font-['Rufina'] text-[42px] leading-none text-[#111] dark:text-white">{note.title}</h5>
                  <p className="mb-3 text-[15px] leading-6 text-slate-700 dark:text-slate-200">{note.content}</p>
                  <div className="mb-3 text-xs text-slate-600 dark:text-slate-300">Created: {formatDateTime(note.createdAt)}</div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      className="h-[34px] rounded-lg border border-slate-300 bg-slate-50 px-3 text-xs font-semibold text-slate-700 dark:border-[#2a2a2a] dark:bg-[#1a1a1a] dark:text-slate-100"
                      onClick={() => loadIntoPutForm(note)}
                      aria-label={`Load note ${note.id} into update form`}
                    >
                      Load Into PUT
                    </Button>
                    <Button
                      type="button"
                      className="h-[34px] rounded-lg bg-red-700 px-3 text-xs font-semibold text-white"
                      disabled={loading.delete}
                      aria-label={`Delete note ${note.id}`}
                      onClick={() => deleteNoteById(note.id, true)}
                    >
                      Delete
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          ) : null}

          {!loading.getAll && notes.length > 0 && viewMode === "table" ? (
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-[#2a2a2a] dark:bg-[#111111]">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 dark:bg-[#1a1a1a] dark:text-slate-100">
                    <th className="border-b border-slate-200 px-3 py-2.5 text-left text-[13px]">ID</th>
                    <th className="border-b border-slate-200 px-3 py-2.5 text-left text-[13px]">Title</th>
                    <th className="border-b border-slate-200 px-3 py-2.5 text-left text-[13px]">Content</th>
                    <th className="border-b border-slate-200 px-3 py-2.5 text-left text-[13px]">Updated</th>
                    <th className="border-b border-slate-200 px-3 py-2.5 text-left text-[13px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedNotes.map((note) => (
                    <tr key={note.id} className="dark:text-slate-100">
                      <td className="border-b border-slate-200 px-3 py-2.5 text-[13px] dark:border-[#2a2a2a]">{note.id}</td>
                      <td className="border-b border-slate-200 px-3 py-2.5 text-[13px] dark:border-[#2a2a2a]">{note.title}</td>
                      <td className="border-b border-slate-200 px-3 py-2.5 text-[13px] dark:border-[#2a2a2a]">{note.content}</td>
                      <td className="border-b border-slate-200 px-3 py-2.5 text-[13px] dark:border-[#2a2a2a]">
                        {formatDateTime(note.updatedAt)}
                      </td>
                      <td className="border-b border-slate-200 px-3 py-2.5 text-[13px] dark:border-[#2a2a2a]">
                        <div className="flex gap-1.5">
                          <Button
                            type="button"
                            className="h-[34px] rounded-lg border border-slate-300 bg-slate-50 px-3 text-xs font-semibold text-slate-700 dark:border-[#2a2a2a] dark:bg-[#1a1a1a] dark:text-slate-100"
                            onClick={() => loadIntoPutForm(note)}
                            aria-label={`Load note ${note.id} into update form`}
                          >
                            PUT
                          </Button>
                          <Button
                            type="button"
                            className="h-[34px] rounded-lg bg-red-700 px-3 text-xs font-semibold text-white"
                            disabled={loading.delete}
                            aria-label={`Delete note ${note.id}`}
                            onClick={() => deleteNoteById(note.id, true)}
                          >
                            DELETE
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-[#2a2a2a] dark:bg-[#111111]">
            <h5 className="mb-2 text-left font-['Rufina'] text-[42px] leading-none text-[#111] dark:text-white">
              Latest Response Snapshot
            </h5>
            {latestResponse ? (
              <div className={responseShellClass}>
                <div className="mb-2 flex items-center justify-between gap-2 text-[13px] text-slate-700 dark:text-slate-200">
                  <span>{latestResponse.endpoint}</span>
                  <span>
                    {latestResponse.status} | {formatDateTime(latestResponse.at)}
                  </span>
                </div>
                <pre className="max-h-[180px] overflow-auto text-xs leading-5 text-slate-800 dark:text-slate-100">
                  {JSON.stringify(latestResponse.data, null, 2)}
                </pre>
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-300">Run any endpoint tester to capture a response.</p>
            )}
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-[#2a2a2a] dark:bg-[#111111]">
            <h5 className="mb-2 text-left font-['Rufina'] text-[42px] leading-none text-[#111] dark:text-white">
              Request Activity
            </h5>
            {activity.length === 0 ? <p className="text-sm text-slate-500 dark:text-slate-300">No API activity yet.</p> : null}
            {activity.map((item) => (
              <div
                className="mt-2 grid grid-cols-[68px_1fr_50px] items-center gap-2 rounded-xl border border-slate-200 p-2 dark:border-[#2a2a2a] dark:bg-[#141414]"
                key={item.id}
              >
                <span
                  className={`inline-flex items-center justify-center rounded-full px-2 py-1 text-[11px] font-semibold ${
                    item.method === "GET"
                      ? "bg-emerald-100 text-emerald-700"
                      : item.method === "POST"
                        ? "bg-blue-100 text-blue-700"
                        : item.method === "PUT"
                          ? "bg-violet-100 text-violet-700"
                          : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {item.method}
                </span>
                <span className="break-all text-xs text-slate-700 dark:text-slate-200">
                  {item.path}
                  {item.info ? ` | ${item.info}` : ""}
                </span>
                <span className="text-right text-xs font-semibold text-slate-900 dark:text-white">{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-2 left-2 right-2 z-50 grid grid-cols-3 gap-2 rounded-xl border border-slate-300 bg-white/95 p-2 shadow-xl backdrop-blur dark:border-[#2a2a2a] dark:bg-[#0b0b0b]/95 md:hidden">
        <Button
          type="button"
          className="h-[38px] rounded-lg bg-slate-100 text-xs font-semibold text-slate-700 dark:bg-[#1a1a1a] dark:text-slate-100"
          aria-label="Refresh all notes"
          loading={loading.getAll}
          onClick={() => fetchNotes(false)}
        >
          Refresh
        </Button>
        <Button
          type="button"
          className="h-[38px] rounded-lg bg-slate-100 text-xs font-semibold text-slate-700 dark:bg-[#1a1a1a] dark:text-slate-100"
          aria-label="Export logs as JSON"
          onClick={exportLogsJson}
        >
          Export JSON
        </Button>
        <Button
          type="button"
          className="h-[38px] rounded-lg bg-slate-100 text-xs font-semibold text-slate-700 dark:bg-[#1a1a1a] dark:text-slate-100"
          aria-label="Scroll to top of notes page"
          onClick={() => smoothScrollTo(0)}
        >
          Top
        </Button>
      </div>
    </section>
  );
};

export default Notes;

