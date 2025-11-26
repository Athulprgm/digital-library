


# Digital Library — LibGo

## Overview

This document provides a clean, minimal, and professional description of the User Module of the Digital Library system. It includes authentication, book operations, request handling, search features, and page access rules.

---

## Authentication

### Login

Users can sign in using their registered email and password. Successful login grants full access to all system pages.

### Register

Users can create an account by providing basic required details. Once registered, they can log in and access all authenticated features.

### Access Rules

* Before login: Only Home (view-only) and Login/Register pages are available.
* After login: All pages become accessible.
* After logout: Access resets to Home (view-only) and Login/Register.

---

## Book Management

### Add Book

Users can add new books with information such as title, author, and category.

### Edit Book

Users can update existing book details whenever needed.

### Return Book

When a borrowed book is returned, the status is updated accordingly.

---

## Request Management

### Send Request

Users can request to borrow a book directly from the list.

### Accept Request

Approvers can confirm book requests. An approval email is sent using Nodemailer.

### Reject Request

Approvers can decline requests. No email is sent for rejected requests.

---

## Search and Filter

Users can search for books by title, author, or keyword. Filters are available for category or genre to refine results.

---

## Pages

### Home

Displays all books. Before login: view-only. After login: interactive features available.

### Add Book

Page for adding new books to the system.

### Borrowed

Shows all books borrowed by the logged-in user.

### My Book

Displays books added by the user.

### Request

Lists all book requests with options to accept or reject.

### Login

Authentication page.

### Register

Account creation page.

---

## Page Access Summary

| Page     | Before Login  | After Login |
| -------- | ------------- | ----------- |
| Home     | View Only     | Full Access |
| Login    | Available     | Hidden      |
| Register | Available     | Hidden      |
| Add Book | Not Available | Available   |
| Borrowed | Not Available | Available   |
| My Book  | Not Available | Available   |
| Request  | Not Available | Available   |

---

## Email Notifications

The system sends automated emails for:

* Request Sent
* Request Accepted

Emails include essential details such as book information and request status.

---

## Summary

This User Module provides:

* Secure login and registration
* Complete book lifecycle management
* Request handling with automated email updates
* Search and filter tools for efficient navigation
* Clear and secure access control

Designed for a clean, reliable, and professional user experience.
