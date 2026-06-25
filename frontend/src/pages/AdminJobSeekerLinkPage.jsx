import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminJobSeekerLinkPage.css";

const API_BASE_URL = "http://127.0.0.1:5000";

function AdminJobSeekerLinkPage() {

  const navigate = useNavigate();

  const [admins, setAdmins] = useState([]);
  const [jobSeekers, setJobSeekers] = useState([]);
  const [links, setLinks] = useState([]);

  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [selectedJobSeekers, setSelectedJobSeekers] = useState([]);

  const [adminKeyword, setAdminKeyword] = useState("");
  const [jobSeekerKeyword, setJobSeekerKeyword] = useState("");

  const [loading, setLoading] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    setMessage("");

    try {
      const [adminsResponse, jobSeekersResponse, linksResponse] =
        await Promise.all([
          fetch(`${API_BASE_URL}/api/admin/admins`),
          fetch(`${API_BASE_URL}/api/admin/job-seekers`),
          fetch(`${API_BASE_URL}/api/admin/job-seekers/links`),
        ]);

      if (!adminsResponse.ok) {
        throw new Error("管理者一覧の取得に失敗しました");
      }

      if (!jobSeekersResponse.ok) {
        throw new Error("求職者一覧の取得に失敗しました");
      }

      const adminsData = await adminsResponse.json();
      const jobSeekersData = await jobSeekersResponse.json();

      setAdmins(adminsData.admins || []);
      setJobSeekers(jobSeekersData.job_seekers || []);

      if (linksResponse.ok) {
        const linksData = await linksResponse.json();
        setLinks(linksData.links || []);
      }
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredAdmins = useMemo(() => {
    if (!adminKeyword.trim()) {
      return admins;
    }

    return admins.filter((admin) => {
      const keyword = adminKeyword.toLowerCase();

      return (
        admin.name?.toLowerCase().includes(keyword) ||
        admin.email?.toLowerCase().includes(keyword) ||
        String(admin.admin_id).includes(keyword)
      );
    });
  }, [admins, adminKeyword]);

  const filteredJobSeekers = useMemo(() => {
    if (!jobSeekerKeyword.trim()) {
      return jobSeekers;
    }

    return jobSeekers.filter((jobSeeker) => {
      const keyword = jobSeekerKeyword.toLowerCase();

      return (
        jobSeeker.name?.toLowerCase().includes(keyword) ||
        jobSeeker.email?.toLowerCase().includes(keyword) ||
        String(jobSeeker.job_seeker_id).includes(keyword)
      );
    });
  }, [jobSeekers, jobSeekerKeyword]);

  const toggleJobSeekerSelection = (jobSeeker) => {
  setSelectedJobSeekers((prev) => {
    const exists = prev.some(
      (item) =>
        item.job_seeker_id === jobSeeker.job_seeker_id
    );

    if (exists) {
      return prev.filter(
        (item) =>
          item.job_seeker_id !== jobSeeker.job_seeker_id
      );
    }

    return [...prev, jobSeeker];
  });
};

  const handleRegisterLink = async () => {
    if (!selectedAdmin || selectedJobSeekers.length === 0) {
      setMessage("管理者と求職者を両方選択してください");
      return;
    }

    setRegistering(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/job-seekers/link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            admin_id: selectedAdmin.admin_id,
            job_seeker_ids: selectedJobSeekers.map(
                (item) => item.job_seeker_id
            ),
}),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "紐づけ登録に失敗しました");
      }

      setMessage("管理者と求職者の紐づけが完了しました");

      setSelectedAdmin(null);
      setSelectedJobSeekers([]);

      await fetchInitialData();
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    } finally {
      setRegistering(false);
    }
  };

  const isAlreadyLinked = (adminId, jobSeekerId) => {
    return links.some(
      (link) =>
        link.admin_id === adminId &&
        link.job_seeker_id === jobSeekerId &&
        link.status === "active"
    );
  };

  /* const selectedPairAlreadyLinked =
    selectedAdmin &&
    selectedJobSeeker &&
    isAlreadyLinked(selectedAdmin.admin_id, selectedJobSeeker.job_seeker_id);
 */
  return (
    <div className="admin-jobseeker-link-page">
      <header className="link-page-header">
        <div>
            <button
            type="button"
            className="back-admin-button"
            onClick={() => navigate("/admin/page")}
            >
                <span className="back-icon">←</span>
                管理者画面に戻る
                </button>

          <h1>管理者・求職者 紐づけ登録</h1>
          <p>
            登録済みの管理者と求職者をクリックで選択し、担当関係を登録します。
          </p>
        </div>

        <button className="reload-button" onClick={fetchInitialData}>
          再読み込み
        </button>
      </header>

      {message && <div className="link-message">{message}</div>}

      {loading ? (
        <div className="loading-box">データを読み込み中...</div>
      ) : (
        <>
          <div className="selection-grid">
            <section className="selection-panel">
              <div className="panel-header">
                <h2>管理者を選択</h2>
                <span>{filteredAdmins.length}件</span>
              </div>

              <input
                className="filter-input"
                type="text"
                value={adminKeyword}
                onChange={(e) => setAdminKeyword(e.target.value)}
                placeholder="名前・メール・IDで絞り込み"
              />

              <div className="person-list">
                {filteredAdmins.length === 0 ? (
                  <p className="empty-text">管理者が見つかりません</p>
                ) : (
                  filteredAdmins.map((admin) => (
                  <button
                  key={admin.admin_id}
                  type="button"
                  className={
                    selectedAdmin?.admin_id === admin.admin_id
                    ? "person-card selected"
                    : "person-card"
                }
                onClick={() => setSelectedAdmin(admin)}
                >
                      <div className="person-name">{admin.name}</div>
                      <div className="person-email">{admin.email}</div>
                      <div className="person-id">管理者ID: {admin.admin_id}</div>
                    </button>
                  ))
                )}
              </div>
            </section>

            <section className="selection-panel">
              <div className="panel-header">
                <h2>求職者を選択</h2>
                <span>{filteredJobSeekers.length}件</span>
              </div>

              <input
                className="filter-input"
                type="text"
                value={jobSeekerKeyword}
                onChange={(e) => setJobSeekerKeyword(e.target.value)}
                placeholder="名前・メール・IDで絞り込み"
              />

              <div className="person-list">
                {filteredJobSeekers.length === 0 ? (
                  <p className="empty-text">求職者が見つかりません</p>
                ) : (
                  filteredJobSeekers.map((jobSeeker) => (
                    <button
                      key={jobSeeker.job_seeker_id}
                      type="button"
                      className={
                        selectedJobSeekers.some(
                            (item) =>
                                item.job_seeker_id === jobSeeker.job_seeker_id
                        )
                          ? "person-card selected"
                          : "person-card"
                      }
                      onClick={() => toggleJobSeekerSelection(jobSeeker)}
                    >
                      <div className="person-name">{jobSeeker.name}</div>
                      <div className="person-email">{jobSeeker.email}</div>
                      <div className="person-id">
                        求職者ID: {jobSeeker.job_seeker_id}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </section>
          </div>

          <section className="confirm-panel">
            <h2>選択内容</h2>

            <div className="confirm-content">
              <div className="selected-person-box">
                <span className="box-label">管理者</span>
                {selectedAdmin ? (
                  <>
                    <strong>{selectedAdmin.name}</strong>
                    <small>{selectedAdmin.email}</small>
                  </>
                ) : (
                  <span className="not-selected">未選択</span>
                )}
              </div>

              <div className="link-arrow">→</div>

              <div className="selected-person-box">
                <span className="box-label">求職者</span>
                {selectedJobSeekers.length > 0 ? (
                    <>
                    {selectedJobSeekers.map((jobSeeker) => (
                        <div
                        key={jobSeeker.job_seeker_id}
                        style={{ marginBottom: "8px" }}
                        >
                            <strong>{jobSeeker.name}</strong>
                            <small
                            style={{
                                display: "block",
                            }}
                            >
                                {jobSeeker.email}
                                </small>
                                </div>
                            ))}
  </>
) : (
  <span className="not-selected">
    未選択
  </span>
)}
              </div>
            </div>

            {/* {selectedPairAlreadyLinked && (
              <div className="warning-message">
                この管理者と求職者はすでに紐づけ済みです。
              </div>
            )} */}

            <button
              className="register-link-button"
              onClick={handleRegisterLink}
             disabled={
                !selectedAdmin ||
                selectedJobSeekers.length === 0 ||
                registering
            }
            >
              {registering ? "登録中..." : "この内容で紐づけ登録"}
            </button>
          </section>

          <section className="current-links-panel">
            <h2>現在の紐づけ一覧</h2>

            {links.length === 0 ? (
              <p className="empty-text">現在、紐づけはありません</p>
            ) : (
              <div className="link-list">
                {links.map((link) => (
                  <div
                    key={link.admin_job_seeker_id}
                    className="current-link-card"
                  >
                    <div>
                      <span className="small-label">管理者</span>
                      <strong>{link.admin_name}</strong>
                      <small>{link.admin_email}</small>
                    </div>

                    <div className="mini-arrow">→</div>

                    <div>
                      <span className="small-label">求職者</span>
                      <strong>{link.job_seeker_name}</strong>
                      <small>{link.job_seeker_email}</small>
                    </div>

                    <span className={`status-badge ${link.status}`}>
                      {link.status === "active" ? "担当中" : "解除済み"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default AdminJobSeekerLinkPage;
