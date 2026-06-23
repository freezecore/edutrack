"""
EduTrack Academy Management System Engine
A terminal-based local Academy Management System.
"""

import json
import os
from datetime import datetime


# ─────────────────────────────────────────────
# REQ-08: @log_action decorator (closure-based)
# ─────────────────────────────────────────────
def log_action(func):
    """Closure-based audit decorator that logs timestamped calls."""
    def wrapper(*args, **kwargs):
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"[LOG] {timestamp} | Called: {func.__name__} | Args: {args[1:]} {kwargs}")
        return func(*args, **kwargs)
    return wrapper


# ─────────────────────────────────────────────
# REQ-01: Base class User
# ─────────────────────────────────────────────
class User:
    def __init__(self, user_id, name, email):
        self.user_id = user_id
        self.name = name
        self.email = email

    def get_dashboard(self):
        """REQ-04: Base dashboard output (overridden by Student)."""
        return (
            f"  ID    : {self.user_id}\n"
            f"  Name  : {self.name}\n"
            f"  Email : {self.email}"
        )


# ─────────────────────────────────────────────
# REQ-02: Student subclass (inherits User)
# ─────────────────────────────────────────────
class Student(User):
    def __init__(self, user_id, name, email):
        super().__init__(user_id, name, email)
        self.courses = []          # list  – sequential course track
        self.attendance = set()    # set   – unique calendar dates (REQ-02, VAL-02)
        self.__grades = {}         # dict  – private grade matrix  (REQ-03)

    # ── Grade setter with validation ──────────
    @log_action
    def add_grade(self, subject, score):
        """REQ-03: Validates score is 0.0–100.0 before storing."""
        try:
            score = float(score)
        except (ValueError, TypeError):
            raise ValueError(f"Score must be a number, got: {score!r}")
        if not (0.0 <= score <= 100.0):
            raise ValueError(f"Score {score} is out of range (0.0 – 100.0).")
        self.__grades[subject] = score
        print(f"  ✔ Grade added: {subject} = {score}")

    # ── Functional grade curve (REQ-06) ───────
    @log_action
    def apply_curve(self, bonus):
        """Applies a bonus to all grades using map() + lambda, capped at 100."""
        curved = list(map(lambda s: min(s + bonus, 100.0), self.__grades.values()))
        subjects = list(self.__grades.keys())
        self.__grades = dict(zip(subjects, curved))
        print(f"  ✔ Curve of +{bonus} applied to all grades.")

    # ── Attendance ────────────────────────────
    @log_action
    def mark_attendance(self, date_str):
        """REQ-02 / VAL-02: Set ensures duplicate dates are ignored."""
        self.attendance.add(date_str)
        print(f"  ✔ Attendance marked: {date_str}")

    # ── Enrol in course ───────────────────────
    @log_action
    def enrol_course(self, course):
        """Adds course to the sequential list."""
        if course not in self.courses:
            self.courses.append(course)
            print(f"  ✔ Enrolled in: {course}")
        else:
            print(f"  ⚠ Already enrolled in: {course}")

    # ── GPA calculator (REQ-05) ───────────────
    def calculate_gpa(self):
        """GPA = (Σ scores / count) / 100 × 4.0"""
        if not self.__grades:
            return 0.0
        avg = sum(self.__grades.values()) / len(self.__grades)
        return round((avg / 100) * 4.0, 2)

    # ── Polymorphic dashboard (REQ-04) ────────
    def get_dashboard(self):
        base = super().get_dashboard()
        gpa = self.calculate_gpa()
        grades_display = (
            "\n".join(f"    {sub}: {score}" for sub, score in self.__grades.items())
            if self.__grades else "    (none)"
        )
        return (
            f"{base}\n"
            f"  Courses   : {', '.join(self.courses) if self.courses else '(none)'}\n"
            f"  Attendance: {sorted(self.attendance) if self.attendance else '(none)'}\n"
            f"  Grades    :\n{grades_display}\n"
            f"  GPA       : {gpa:.2f}"
        )

    # ── Serialisation helpers ─────────────────
    def to_dict(self):
        return {
            "user_id": self.user_id,
            "name": self.name,
            "email": self.email,
            "courses": self.courses,
            "attendance": list(self.attendance),   # set → list for JSON
            "grades": self.__grades,               # name-mangled access via method
        }

    # Access private grades for serialisation
    def get_grades(self):
        return dict(self.__grades)

    @classmethod
    def from_dict(cls, data):
        """Rebuild Student from a JSON dict (REQ-11: cast JSON arrays → sets)."""
        s = cls(data["user_id"], data["name"], data["email"])
        s.courses = data.get("courses", [])
        s.attendance = set(data.get("attendance", []))   # list → set
        for subject, score in data.get("grades", {}).items():
            s._Student__grades[subject] = float(score)
        return s


# ─────────────────────────────────────────────
# REQ-10: Generator for batch profile streaming
# ─────────────────────────────────────────────
def student_profile_generator(registry):
    """Yields one student dashboard at a time – memory-efficient."""
    for student in registry.values():
        yield student.get_dashboard()


# ─────────────────────────────────────────────
# REQ-07: Honours list via list comprehension
# ─────────────────────────────────────────────
def get_honours_list(registry):
    """Returns students with GPA ≥ 3.5 using list comprehension."""
    return [s for s in registry.values() if s.calculate_gpa() >= 3.5]


# ─────────────────────────────────────────────
# REQ-11 & REQ-12: File persistence (JSON)
# ─────────────────────────────────────────────
DB_FILE = "database.json"

def load_database():
    """REQ-11: Load and decode database.json if it exists."""
    registry = {}
    if os.path.exists(DB_FILE):
        try:
            with open(DB_FILE, "r") as f:
                data = json.load(f)
            for record in data:
                s = Student.from_dict(record)
                registry[s.user_id] = s
            print(f"  ✔ Loaded {len(registry)} student(s) from {DB_FILE}.")
        except (json.JSONDecodeError, KeyError) as e:
            print(f"  ⚠ Could not load database: {e}. Starting fresh.")
    else:
        print(f"  ℹ No existing database found. Starting fresh.")
    return registry

def save_database(registry):
    """REQ-12: Marshal all student state to indented JSON and write to disk."""
    with open(DB_FILE, "w") as f:
        records = [s.to_dict() for s in registry.values()]
        json.dump(records, f, indent=4)
    print(f"  ✔ Database saved to {DB_FILE} ({len(registry)} student(s)).")


# ─────────────────────────────────────────────
# Main CLI loop
# ─────────────────────────────────────────────
def main():
    print("=" * 50)
    print("  EduTrack Academy Management System")
    print("=" * 50)

    registry = load_database()

    menu = """
┌─────────────────────────────────┐
│  1. Add Student                 │
│  2. View Student Dashboard      │
│  3. Enrol Student in Course     │
│  4. Mark Attendance             │
│  5. Add Grade                   │
│  6. Apply Grade Curve           │
│  7. View All Students           │
│  8. View Honours List (GPA≥3.5) │
│  9. Save & Exit                 │
└─────────────────────────────────┘
"""

    while True:
        print(menu)
        # REQ-09: Wrap all input handling in try/except
        try:
            choice = input("Enter option: ").strip()

            # ── 1. Add Student ─────────────────────
            if choice == "1":
                uid = input("  Student ID  : ").strip()
                if not uid:
                    raise ValueError("Student ID cannot be empty.")
                if uid in registry:
                    print("  ⚠ A student with that ID already exists.")
                    continue
                name = input("  Name        : ").strip()
                email = input("  Email       : ").strip()
                registry[uid] = Student(uid, name, email)
                print(f"  ✔ Student '{name}' added successfully.")

            # ── 2. View Dashboard ──────────────────
            elif choice == "2":
                uid = input("  Student ID: ").strip()
                if uid not in registry:
                    raise KeyError(f"No student found with ID '{uid}'.")
                print("\n" + "─" * 40)
                print(registry[uid].get_dashboard())
                print("─" * 40)

            # ── 3. Enrol in Course ─────────────────
            elif choice == "3":
                uid = input("  Student ID : ").strip()
                if uid not in registry:
                    raise KeyError(f"No student found with ID '{uid}'.")
                course = input("  Course Name: ").strip()
                if not course:
                    raise ValueError("Course name cannot be empty.")
                registry[uid].enrol_course(course)

            # ── 4. Mark Attendance ─────────────────
            elif choice == "4":
                uid = input("  Student ID : ").strip()
                if uid not in registry:
                    raise KeyError(f"No student found with ID '{uid}'.")
                date = input("  Date (YYYY-MM-DD, or press Enter for today): ").strip()
                if not date:
                    date = datetime.now().strftime("%Y-%m-%d")
                registry[uid].mark_attendance(date)

            # ── 5. Add Grade ───────────────────────
            elif choice == "5":
                uid = input("  Student ID : ").strip()
                if uid not in registry:
                    raise KeyError(f"No student found with ID '{uid}'.")
                subject = input("  Subject    : ").strip()
                score_input = input("  Score (0–100): ").strip()
                registry[uid].add_grade(subject, score_input)

            # ── 6. Apply Curve ─────────────────────
            elif choice == "6":
                uid = input("  Student ID : ").strip()
                if uid not in registry:
                    raise KeyError(f"No student found with ID '{uid}'.")
                bonus_input = input("  Bonus points to add: ").strip()
                bonus = float(bonus_input)
                registry[uid].apply_curve(bonus)

            # ── 7. View All Students ───────────────
            elif choice == "7":
                if not registry:
                    print("  ℹ No students registered yet.")
                else:
                    print("\n" + "═" * 40)
                    for dashboard in student_profile_generator(registry):   # REQ-10
                        print(dashboard)
                        print("─" * 40)

            # ── 8. Honours List ────────────────────
            elif choice == "8":
                honours = get_honours_list(registry)   # REQ-07
                if not honours:
                    print("  ℹ No students currently qualify for honours (GPA ≥ 3.5).")
                else:
                    print(f"\n  🏅 Honours List ({len(honours)} student(s)):")
                    for s in honours:
                        print(f"    • {s.name} (ID: {s.user_id}) — GPA: {s.calculate_gpa():.2f}")

            # ── 9. Save & Exit ─────────────────────
            elif choice == "9":
                save_database(registry)   # REQ-12
                print("  Goodbye! 👋")
                break

            else:
                print("  ⚠ Invalid option. Please enter a number from 1–9.")

        # REQ-09: Catch specific exceptions cleanly
        except ValueError as ve:
            print(f"  ✘ Input Error: {ve}")
        except KeyError as ke:
            print(f"  ✘ Not Found: {ke}")
        except Exception as e:
            print(f"  ✘ Unexpected Error: {e}")


if __name__ == "__main__":
    main()
