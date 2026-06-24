import { useState } from "react";

function App() {
const [rollNo, setRollNo] = useState("");
const [student, setStudent] = useState(null);
const [loading, setLoading] = useState(false);
const [notFound, setNotFound] = useState(false);
const [error, setError] = useState("");

const fetchStudent = async () => {
if (!rollNo.trim()) return;
try {
  setLoading(true);
  setError("");
  setNotFound(false);
  setStudent(null);

  const res = await fetch(
    `https://ct.ofzen.in/api/student/profile?userId=${rollNo}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch");
  }

  const data = await res.json();

  if (
    !data ||
    data.message === "Student not found" ||
    Object.keys(data).length === 0 ||
    !data.student_id
  ) {
    setNotFound(true);
    return;
  }

  setStudent(data);
} catch (err) {
  setNotFound(true);
} finally {
  setLoading(false);
}


};

const totalLeetcodeSolved = student
? student.performance.platformWise.leetcode.easy +
student.performance.platformWise.leetcode.medium +
student.performance.platformWise.leetcode.hard
: 0;

return ( <div className="min-h-screen bg-slate-100">
 <nav className="bg-white shadow-sm border-b"> <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center"> <h1 className="text-2xl font-bold text-blue-600">
Campus Coding Tracker </h1>

      <a
        href="https://ct.ofzen.in/"
        target="_blank"
        rel="noreferrer"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Create Account
      </a>
    </div>
  </nav>

  <div className="max-w-7xl mx-auto px-6 py-10">
    {/* Search */}
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-3xl font-bold text-center text-gray-800">
        Search Student Coding Profile
      </h2>

      <p className="text-center text-gray-500 mt-2">
        Enter your roll number to view coding statistics
      </p>

      <div className="flex flex-col md:flex-row gap-3 justify-center mt-8">
        <input
          type="text"
          value={rollNo}
          placeholder="Enter Roll Number"
          onChange={(e) => setRollNo(e.target.value.toUpperCase())}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              fetchStudent();
            }
          }}
          className="border border-gray-300 rounded-xl px-4 py-3 w-full md:w-[400px] outline-none focus:border-blue-500"
        />

        <button
          onClick={fetchStudent}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl"
        >
          Search
        </button>
      </div>
    </div>

    {loading && (
      <div className="text-center mt-10">
        <p className="text-lg font-semibold text-blue-600">
          Loading profile...
        </p>
      </div>
    )}

    {error && (
      <div className="text-center mt-6 text-red-500">
        {error}
      </div>
    )}

    {/* Not Found */}
    {notFound && (
      <div className="bg-white mt-10 rounded-2xl shadow-lg p-10 text-center">
        <div className="text-7xl">🚀</div>

        <h2 className="text-3xl font-bold mt-4">
          Profile Not Found
        </h2>

        <p className="text-gray-500 mt-3">
          This roll number is not registered yet.
        </p>

        <p className="text-gray-500 mb-8">
          Create an account and connect your coding profiles.
        </p>

        <a
          href="https://ct.ofzen.in/"
          target="_blank"
          rel="noreferrer"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl"
        >
          Create Account
        </a>
      </div>
    )}

    {/* Student Data */}
    {student && (
      <>
        {/* Profile */}
        <div className="bg-white mt-10 rounded-2xl shadow-lg p-8">
          <div className="flex flex-col lg:flex-row justify-between">
            <div>
              <h2 className="text-4xl font-bold">
                {student.name}
              </h2>

              <p className="text-gray-500 mt-2">
                {student.student_id}
              </p>

              <p className="text-gray-500">
                {student.dept_name} • Year {student.year}
              </p>

              <p className="text-gray-500">
                {student.degree}
              </p>
            </div>

            <div className="mt-6 lg:mt-0">
              <div className="bg-blue-50 p-6 rounded-xl">
                <p className="font-semibold">
                  Campus Rank: #{student.overall_rank}
                </p>

                <p className="font-semibold mt-2">
                  Score: {student.score}
                </p>

                <p className="font-semibold mt-2">
                  Status: {student.status}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-gray-500">Total Solved</h3>
            <p className="text-4xl font-bold mt-2">
              {student.performance.combined.totalSolved}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-gray-500">Contests</h3>
            <p className="text-4xl font-bold mt-2">
              {student.performance.combined.totalContests}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-gray-500">GitHub Repos</h3>
            <p className="text-4xl font-bold mt-2">
              {student.performance.platformWise.github.repos}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-gray-500">Contributions</h3>
            <p className="text-4xl font-bold mt-2">
              {student.performance.platformWise.github.contributions}
            </p>
          </div>
        </div>

        {/* Platforms */}
        <div className="mt-10">
          <h2 className="text-3xl font-bold mb-6">
            Coding Platforms
          </h2>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-bold text-xl mb-4">
                LeetCode
              </h3>

              <p>Username: {student.coding_profiles.leetcode_id}</p>
              <p>Solved: {totalLeetcodeSolved}</p>
              <p>
                Rating:{" "}
                {student.performance.platformWise.leetcode.rating}
              </p>
              <p>
                Contests:{" "}
                {student.performance.platformWise.leetcode.contests}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-bold text-xl mb-4">
                GeeksforGeeks
              </h3>

              <p>
                Username:{" "}
                {student.coding_profiles.geeksforgeeks_id}
              </p>

              <p>
                Easy: {student.performance.platformWise.gfg.easy}
              </p>

              <p>
                Medium: {student.performance.platformWise.gfg.medium}
              </p>

              <p>
                Basic: {student.performance.platformWise.gfg.basic}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-bold text-xl mb-4">
                CodeChef
              </h3>

              <p>
                Username: {student.coding_profiles.codechef_id}
              </p>

              <p>
                Problems:{" "}
                {student.performance.platformWise.codechef.problems}
              </p>

              <p>
                Rating:{" "}
                {student.performance.platformWise.codechef.rating}
              </p>

              <p>
                Stars:{" "}
                {student.performance.platformWise.codechef.stars}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-bold text-xl mb-4">
                HackerRank
              </h3>

              <p>
                Username:{" "}
                {student.coding_profiles.hackerrank_id}
              </p>

              <p>
                Total Stars:{" "}
                {student.performance.platformWise.hackerrank.totalStars}
              </p>

              {student.performance.platformWise.hackerrank.badgesList.map(
                (badge, index) => (
                  <p key={index}>
                    {badge.name}: ⭐ {badge.stars}
                  </p>
                )
              )}
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-bold text-xl mb-4">
                GitHub
              </h3>

              <p>
                Username: {student.coding_profiles.github_id}
              </p>

              <p>
                Repositories:{" "}
                {student.performance.platformWise.github.repos}
              </p>

              <p>
                Contributions:{" "}
                {student.performance.platformWise.github.contributions}
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow p-6">
              <h3 className="font-bold text-xl mb-4">
                Overall Summary
              </h3>

              <p>
                Solved:{" "}
                {student.performance.combined.totalSolved}
              </p>

              <p>
                Contests:{" "}
                {student.performance.combined.totalContests}
              </p>

              <p>Score: {student.score}</p>

              <p>
                Rank: #{student.overall_rank}
              </p>
            </div>
          </div>
        </div>
      </>
    )}
  </div>
</div>
);
}

export default App;
