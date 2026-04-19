import { GoogleGenerativeAI } from '@google/generative-ai'
import { geminiSystemInstruction } from '../config/geminiPersona.js'

/**
 * v1 API gövdesinde systemInstruction alanı yok → 400 "Unknown name systemInstruction".
 * Sistem talimatı için v1beta kullanılmalı (@google/generative-ai ile uyumlu).
 *
 * Not: @google/generative-ai içinde GenerativeModel, model adında "/" yoksa zaten
 * "models/<ad>" yapar; .env'de "models/gemini-…" yazmak ile "gemini-…" yazmak aynı URL'yi üretir.
 * 404 alıyorsanız sebep eksik "models/" değil, hesapta o modelin olmamasıdır.
 */
const DEFAULT_API_VERSION = 'v1beta'

/** @param {string} id */
function normalizeGeminiModelId(id) {
  return String(id || '')
    .trim()
    .replace(/^models\//i, '')
}

/**
 * Varsayılan: Gemini 2.0 Flash — kısa ad 404 verirse sürümlü yedek denenir.
 * @see https://ai.google.dev/gemini-api/docs/models
 */
const DEFAULT_MODEL = 'gemini-2.0-flash'

const FLASH_20_FALLBACKS = ['gemini-2.0-flash', 'gemini-2.0-flash-001']

function getModelCandidates(explicitFromEnv) {
  const m = normalizeGeminiModelId(explicitFromEnv || DEFAULT_MODEL) || DEFAULT_MODEL
  if (m === 'gemini-2.0-flash') {
    return [...FLASH_20_FALLBACKS]
  }
  return [m]
}

/**
 * UI mesaj listesinden Gemini chat history + son kullanıcı metnini üretir.
 * İlk mesajlar opsiyonel AI karşılama olabilir; history çiftleri user/model ile başlar.
 */
function buildHistoryAndLatest(messages) {
  const last = messages[messages.length - 1]
  if (!last || last.type !== 'user') {
    throw new Error('INVALID_MESSAGES')
  }
  const rest = messages.slice(0, -1)
  const history = []
  let i = 0
  while (i < rest.length && rest[i].type === 'ai') {
    i += 1
  }
  while (i < rest.length) {
    if (rest[i].type === 'user') {
      const u = rest[i].text
      if (i + 1 < rest.length && rest[i + 1].type === 'ai') {
        history.push({ role: 'user', parts: [{ text: u }] })
        history.push({ role: 'model', parts: [{ text: rest[i + 1].text }] })
        i += 2
      } else {
        break
      }
    } else {
      i += 1
    }
  }
  return { history, latestUserText: last.text }
}

/**
 * SDK mesajı: "Error fetching from ...: [400 Bad Request] <google mesajı>"
 */
function extractGoogleDetail(raw) {
  const s = String(raw)
  const bracket = s.match(/\]\s*(.+)$/)
  return bracket ? bracket[1].trim().slice(0, 280) : ''
}

export function mapGeminiError(err) {
  const code = err?.message
  if (code === 'MISSING_API_KEY') {
    return 'Yapılandırma eksik: VITE_GEMINI_API_KEY tanımlı değil. Proje kökündeki .env dosyasına anahtarınızı ekleyin.'
  }
  if (code === 'INVALID_MESSAGES') {
    return 'Sohbet durumu geçersiz. Sayfayı yenileyip tekrar deneyin.'
  }

  const status = typeof err?.status === 'number' ? err.status : null
  const raw = String(err?.message || err)
  const lower = raw.toLowerCase()
  const detail = extractGoogleDetail(raw)

  // ÖNEMLİ: SDK tüm HTTP hatalarını "Error fetching from ..." ile sarmalar; "fetch" kelimesi ağ hatası DEĞİLDİR.
  // Gerçek ağ kopması genelde status yoktur veya "Failed to fetch" içerir.

  if (
    status === 404 ||
    lower.includes('not found') ||
    lower.includes('is not found for api version')
  ) {
    return 'Model bulunamadı (404). VITE_GEMINI_MODEL=gemini-2.0-flash kullanın (kod -001 yedeği dener). VITE_GEMINI_API_VERSION=v1beta kalsın. Sunucuyu yeniden başlatın.'
  }

  if (
    lower.includes('systeminstruction') &&
    (lower.includes('unknown name') || lower.includes('cannot find field'))
  ) {
    return 'Sistem talimatı (systemInstruction) v1 API’de yok; v1beta gerekir. .env içinde VITE_GEMINI_API_VERSION=v1beta yapın veya bu satırı silin (varsayılan v1beta), ardından npm run dev ile yeniden başlatın. Hâlâ v1 yazıyorsa kaldırın.'
  }

  if (status === 400 || lower.includes('[400') || lower.includes('bad request')) {
    let msg =
      'İstek reddedildi (400): Sunucu isteği geçersiz buldu — bu genelde internet kopması değildir. Model adı, API sürümü (v1 / v1beta) veya hesap/bölge kısıtı olabilir.'
    if (detail) {
      msg += ` Ayrıntı: ${detail}`
    }
    msg +=
      ' Sistem talimatı için v1beta kullanın. Konsoldaki tam hatayı kontrol edin; gerekirse VITE_GEMINI_MODEL değiştirin.'
    return msg
  }

  if (
    status === 401 ||
    lower.includes('api key') ||
    lower.includes('api_key') ||
    lower.includes('invalid api key') ||
    lower.includes('permission denied')
  ) {
    return 'API anahtarı geçersiz veya erişim reddedildi. Google AI Studio’daki anahtarı kontrol edin.'
  }

  if (status === 403) {
    return 'Erişim reddedildi (403). API veya proje ayarlarınızı Google Cloud / AI Studio üzerinden kontrol edin.'
  }

  if (
    status === 429 ||
    lower.includes('429') ||
    lower.includes('quota') ||
    lower.includes('resource exhausted') ||
    lower.includes('too many requests')
  ) {
    let msg =
      'Kota veya hız limiti (429): Bu bir internet kopması değildir. Google AI Studio veya Cloud Console’dan Usage / Billing kontrol edin.'

    if (
      lower.includes('free_tier') &&
      (lower.includes('limit: 0') || lower.includes('limit is 0'))
    ) {
      msg =
        'Google isteğinizi hâlâ "ücretsiz katman" (free tier) kotasına yazıyor ve bu kotada limit 0 görünüyor — yani ücretli kullanım henüz bu API anahtarına yansımamış. AI Studio → projeniz → Gemini faturalandırma / ön ödeme kredisi (Buy credits) ile bakiyeyi doğrulayın; Cloud’a yaptığınız ödeme ile Gemini prepay aynı cüzdan olmayabilir. Sorun sürerse Google destek.'
    } else if (
      lower.includes('free_tier') ||
      lower.includes('billing') ||
      lower.includes('plan')
    ) {
      msg +=
        ' Konsolda "free_tier" geçiyorsa kota ücretsiz katmanla ilişkilidir; faturalı kullanım için AI Studio’daki Gemini ön ödeme bakiyesini kontrol edin.'
    } else {
      msg +=
        ' Ücretsiz katman günlük/dakikalık sınırı dolmuş olabilir; bir süre bekleyin veya faturalandırmayı / başka proje anahtarını deneyin.'
    }
    if (detail && detail.length < 220) {
      msg += ` Ayrıntı: ${detail}`
    }
    return msg
  }

  if (lower.includes('blocked') || lower.includes('safety')) {
    return 'Güvenlik filtresi nedeniyle yanıt üretilemedi. Mesajınızı sadeleştirip tekrar deneyin.'
  }

  // Gerçek tarayıcı ağ hataları (SDK status vermeyebilir)
  if (
    !status &&
    (lower.includes('failed to fetch') ||
      lower.includes('networkerror') ||
      lower.includes('load failed') ||
      lower.includes('err_network') ||
      (err?.name === 'TypeError' && lower.includes('fetch')))
  ) {
    return 'Ağ bağlantısı hatası. İnternetinizi kontrol edip tekrar deneyin.'
  }

  if (status && status >= 500) {
    return 'Google sunucuları geçici olarak yanıt veremedi. Bir süre sonra tekrar deneyin.'
  }

  if (detail) {
    return `İstek başarısız: ${detail}`
  }
  return 'Bir hata oluştu. Lütfen tekrar deneyin.'
}

/**
 * @param {object} params
 * @param {Array<{ type: 'user'|'ai', text: string }>} params.messages - Son eleman kullanıcı olmalı
 * @param {string} [params.systemInstruction]
 * @returns {Promise<string>}
 */
export async function generateChatReply({
  messages,
  systemInstruction = geminiSystemInstruction
}) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey || !String(apiKey).trim()) {
    throw new Error('MISSING_API_KEY')
  }

  const envModel = import.meta.env.VITE_GEMINI_MODEL
  const candidates = getModelCandidates(envModel)

  const apiVersion =
    import.meta.env.VITE_GEMINI_API_VERSION?.trim() || DEFAULT_API_VERSION

  const { history, latestUserText } = buildHistoryAndLatest(messages)

  const genAI = new GoogleGenerativeAI(apiKey)

  let lastErr
  for (let i = 0; i < candidates.length; i++) {
    const modelName = candidates[i]
    try {
      const model = genAI.getGenerativeModel(
        {
          model: modelName,
          systemInstruction,
          generationConfig: {
            temperature: 0.65,
            maxOutputTokens: 1024
          }
        },
        { apiVersion }
      )

      const chat = model.startChat({ history })
      const result = await chat.sendMessage(latestUserText)
      const text = result.response.text()

      if (import.meta.env.DEV && i > 0) {
        console.info(`[Gemini] model "${modelName}" ile yanıt alındı (${i + 1}. deneme)`)
      }
      return text
    } catch (e) {
      lastErr = e
      const is404 = typeof e?.status === 'number' && e.status === 404
      if (is404 && i < candidates.length - 1) {
        if (import.meta.env.DEV) {
          console.warn(`[Gemini] "${modelName}" 404, sıradaki model deneniyor…`)
        }
        continue
      }
      throw e
    }
  }

  throw lastErr
}
