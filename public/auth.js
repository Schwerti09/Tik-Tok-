/**
 * Frontend authentication module using the Supabase JavaScript client.
 *
 * The Supabase client handles session persistence in localStorage automatically
 * when `persistSession` is true (which is the default).  The app also calls the
 * Netlify Function endpoints for server-side operations (signup uses the admin
 * API; login/logout use the client directly for simplicity).
 */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// ---------------------------------------------------------------------------
// Supabase client – reads project URL and anon key from the page's meta tags
// so that the same static file can be deployed to different environments
// without rebuilding.
// ---------------------------------------------------------------------------

const SUPABASE_URL = document.querySelector('meta[name="supabase-url"]')?.getAttribute('content') ?? ''
const SUPABASE_ANON_KEY = document.querySelector('meta[name="supabase-anon-key"]')?.getAttribute('content') ?? ''

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,          // session is stored in localStorage
    storageKey: 'tiktok-auth',     // localStorage key prefix
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

// ---------------------------------------------------------------------------
// UI helpers
// ---------------------------------------------------------------------------

/** @param {'login'|'signup'} tab */
window.switchTab = function switchTab(tab) {
  document.getElementById('login-form').style.display = tab === 'login' ? '' : 'none'
  document.getElementById('signup-form').style.display = tab === 'signup' ? '' : 'none'
  document.getElementById('tab-login').classList.toggle('active', tab === 'login')
  document.getElementById('tab-signup').classList.toggle('active', tab === 'signup')
  clearMessage()
}

/**
 * @param {string} text
 * @param {'success'|'error'} type
 */
function showMessage(text, type) {
  const el = document.getElementById('message')
  el.textContent = text
  el.className = type
  el.style.display = 'block'
}

function clearMessage() {
  const el = document.getElementById('message')
  el.style.display = 'none'
  el.textContent = ''
  el.className = ''
}

function setLoading(btnId, loading) {
  const btn = document.getElementById(btnId)
  btn.disabled = loading
  btn.textContent = loading ? 'Please wait…' : btn.dataset.label
}

// Store original button labels
document.addEventListener('DOMContentLoaded', () => {
  ;['login-submit', 'signup-submit'].forEach((id) => {
    const btn = document.getElementById(id)
    if (btn) btn.dataset.label = btn.textContent
  })
})

// ---------------------------------------------------------------------------
// Session state
// ---------------------------------------------------------------------------

function showLoggedIn(user) {
  document.getElementById('auth-section').style.display = 'none'
  document.getElementById('logged-in').style.display = 'block'
  document.getElementById('user-email').textContent = user.email
}

function showLoggedOut() {
  document.getElementById('auth-section').style.display = 'block'
  document.getElementById('logged-in').style.display = 'none'
}

// Restore session on page load
;(async () => {
  const { data } = await supabase.auth.getSession()
  if (data.session?.user) {
    showLoggedIn(data.session.user)
  }
})()

// React to auth state changes (e.g. token refresh, sign-out in another tab)
supabase.auth.onAuthStateChange((_event, session) => {
  if (session?.user) {
    showLoggedIn(session.user)
  } else {
    showLoggedOut()
  }
})

// ---------------------------------------------------------------------------
// Signup – calls the Netlify Function which uses the admin API
// ---------------------------------------------------------------------------

window.handleSignup = async function handleSignup(event) {
  event.preventDefault()
  clearMessage()
  setLoading('signup-submit', true)

  const username = document.getElementById('signup-username').value.trim()
  const email = document.getElementById('signup-email').value.trim()
  const password = document.getElementById('signup-password').value

  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, username })
    })

    const result = await response.json()

    if (!response.ok) {
      showMessage(result.error ?? 'Signup failed', 'error')
      return
    }

    // Account created – sign in immediately so the session is stored
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      showMessage('Account created! Please log in.', 'success')
      switchTab('login')
      return
    }

    showLoggedIn(data.user)
  } catch {
    showMessage('Network error – please try again.', 'error')
  } finally {
    setLoading('signup-submit', false)
  }
}

// ---------------------------------------------------------------------------
// Login – uses the Supabase client directly; session is persisted automatically
// ---------------------------------------------------------------------------

window.handleLogin = async function handleLogin(event) {
  event.preventDefault()
  clearMessage()
  setLoading('login-submit', true)

  const email = document.getElementById('login-email').value.trim()
  const password = document.getElementById('login-password').value

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      showMessage(error.message, 'error')
      return
    }

    showLoggedIn(data.user)
  } catch {
    showMessage('Network error – please try again.', 'error')
  } finally {
    setLoading('login-submit', false)
  }
}

// ---------------------------------------------------------------------------
// Logout – signs out via Supabase client (clears localStorage session) and
// calls the Netlify Function to invalidate the token server-side.
// ---------------------------------------------------------------------------

window.handleLogout = async function handleLogout() {
  const { data } = await supabase.auth.getSession()
  const accessToken = data.session?.access_token

  // Sign out on the client first so localStorage is cleared
  await supabase.auth.signOut()

  // Optionally invalidate the token server-side
  if (accessToken) {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` }
      })
    } catch {
      // Non-fatal – client session is already cleared
    }
  }

  showLoggedOut()
}
