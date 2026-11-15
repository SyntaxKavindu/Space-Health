export const HAZARDS = {
  radiation: { label: 'Space radiation', short: 'Radiation', desc: 'Raises long-term risks for the heart, immune system and tissues.' },
  isolation: { label: 'Isolation and confinement', short: 'Isolation', desc: 'Affects sleep, mood and team behavior.' },
  distance: { label: 'Distance from Earth', short: 'Distance', desc: 'Delays help and resupply, so the crew must act first.' },
  gravity: { label: 'Gravity fields', short: 'Gravity', desc: 'Microgravity shifts fluids and weakens bones and muscles.' },
  closed: { label: 'Hostile closed environments', short: 'Closed environment', desc: 'Air, temperature, germs and food in a sealed habitat.' },
}

export const CONTACT_MESSAGE = 'Contact the flight surgeon now.'

export const INDICATORS = [
  {
    id: 'hr', label: 'Heart rate', unit: 'bpm', min: 30, max: 220, normal: [60, 100], caution: [50, 110],
    part: 'heart', every: 1, drift: 15, hazards: ['gravity', 'radiation'],
    why: 'Radiation and fluid shifts in microgravity can strain the heart. A resting rate that drifts is an early warning.',
    low: 'Rest and measure again in 10 minutes. If it stays low or you feel faint, contact the flight surgeon.',
    high: 'Rest, drink water and measure again. If it stays high or you have chest pain, contact the flight surgeon.',
    steps: ['Sit still for 5 minutes.', 'Place two fingers on your wrist, or put on the wearable sensor.', 'Count beats for 30 seconds and multiply by 2, or read the sensor.', 'Enter the number.'],
  },
  {
    id: 'sys', label: 'Blood pressure (top number)', short: 'Blood pressure', unit: 'mmHg', min: 60, max: 250,
    normal: [90, 129], caution: [80, 139], part: 'heart', every: 1, drift: 12, hazards: ['gravity'],
    why: 'Fluid moves toward the head in microgravity, so blood pressure can behave differently than on Earth.',
    low: 'Sit or lie down, drink fluids and measure again. If dizzy or it stays low, contact the flight surgeon.',
    high: 'Rest, reduce salt and stress, then measure again. If it stays high, contact the flight surgeon.',
    steps: ['Rest and sit still for 5 minutes. Do not talk.', 'Wrap the cuff around your upper arm, level with your heart.', 'Press start and keep your arm relaxed.', 'Enter the top number (systolic).'],
  },
  {
    id: 'dia', label: 'Blood pressure (bottom number)', unit: 'mmHg', min: 30, max: 150,
    normal: [60, 84], caution: [50, 89], part: 'heart', every: 1, drift: 15, hazards: [],
    why: 'Read together with the top number to judge how hard the heart and vessels are working.',
    low: 'Sit or lie down, drink fluids and measure again. If it stays low, contact the flight surgeon.',
    high: 'Rest, reduce salt and stress, then measure again. If it stays high, contact the flight surgeon.',
    steps: ['Use the same reading from the blood pressure cuff.', 'Enter the bottom number (diastolic).'],
  },
  {
    id: 'glucose', label: 'Blood sugar', unit: 'mg/dL', min: 30, max: 500, normal: [70, 140], caution: [60, 180],
    part: 'metabolism', every: 7, drift: 25, hazards: ['closed'],
    why: 'Stress, diet changes and less physical activity in space can shift blood sugar.',
    low: 'Eat or drink something with sugar and measure again in 15 minutes. If it stays low, contact the flight surgeon.',
    high: 'Drink water, take a light exercise session and measure again. If it stays high, contact the flight surgeon.',
    steps: ['Wash and dry your hands.', 'Insert a test strip into the glucometer.', 'Prick the side of a fingertip and touch the drop to the strip.', 'Wait for the result and enter the mg/dL value.'],
  },
  {
    id: 'temp', label: 'Body temperature', unit: '°C', min: 33, max: 42, step: 0.1, normal: [36.1, 37.5], caution: [35.5, 38],
    part: 'body', every: 1, drift: 1.5, hazards: ['closed'],
    why: 'Heat leaves the body differently in microgravity and in closed cabins, and a fever can signal an infection.',
    low: 'Warm up, rest and measure again. If it stays low, contact the flight surgeon.',
    high: 'Rest, drink water and cool your area. If the fever continues, contact the flight surgeon.',
    steps: ['Use the same thermometer and method each time.', 'Wait 15 minutes after exercise or a hot drink.', 'Hold the thermometer in place until it beeps.', 'Enter the temperature in °C.'],
  },
  {
    id: 'sleep', label: 'Sleep last night', unit: 'hours', min: 0, max: 16, step: 0.5, normal: [7, 9], caution: [6, 10],
    part: 'brain', every: 1, drift: 20, hazards: ['isolation', 'closed'],
    why: 'Odd light cycles, noise and stress make sleep harder in space, and poor sleep affects mood and judgment.',
    low: 'Dim the lights an hour before bed, keep a fixed sleep time and avoid caffeine late in the day.',
    high: 'Oversleeping can signal fatigue or low mood. Keep a regular schedule and tell the flight surgeon if it continues.',
    steps: ['Think about when you fell asleep and when you woke up.', 'Subtract the time you were awake in the night.', 'Enter the total hours. You can use halves, like 6.5.'],
  },
  {
    id: 'mood', label: 'Mood', unit: '/ 5', min: 1, max: 5, normal: [3, 5], caution: [2, 5],
    part: 'brain', every: 1, drift: 30, hazards: ['isolation', 'distance'],
    why: 'Isolation, confinement and distance from Earth affect mental health, so tracking mood helps catch problems early.',
    low: 'Talk to a crewmate or family on the comms link, get some exercise, and tell the flight surgeon if low mood lasts several days.',
    high: 'Great. Keep up the routines that help you.',
    steps: ['Ask yourself how you feel right now.', 'Pick the option that fits best, from Very low to Great.'],
  },
  {
    id: 'exercise', label: 'Exercise today', unit: 'min', min: 0, max: 300, step: 5, normal: [60, 150], caution: [30, 240],
    part: 'bones', every: 1, drift: 40, hazards: ['gravity'],
    why: 'Microgravity takes load off bones and muscles, so daily resistance and cardio exercise is the main way to protect them.',
    low: 'Do a resistance or treadmill session today to protect your bones and muscles.',
    high: 'Great effort, but rest and hydrate. Too much training raises the risk of injury.',
    steps: ['Add up the minutes of resistance and cardio exercise you did today.', 'Do not count warm-up walking.', 'Enter the total minutes.'],
  },
]

export const PARTS = {
  brain: { name: 'Brain and mood', fn: 'Controls thinking, sleep and emotions.', risk: 'Isolation, confinement and disrupted light cycles affect sleep and mental health.' },
  heart: { name: 'Heart and blood vessels', fn: 'Pumps blood around the body.', risk: 'Radiation and fluid shifts in microgravity can change heart rate and blood pressure.' },
  body: { name: 'Whole body', fn: 'Keeps body temperature stable.', risk: 'Closed cabins and microgravity change how heat leaves the body, and infections can show up as fever.' },
  metabolism: { name: 'Metabolism', fn: 'Turns food into energy and controls blood sugar.', risk: 'Diet changes, stress and less activity can shift blood sugar.' },
  bones: { name: 'Bones and muscles', fn: 'Support the body and allow movement.', risk: 'Microgravity causes bone density and muscle loss. Daily resistance exercise is the main countermeasure.' },
}

export const STATUS_LABEL = { none: 'No data', good: 'Normal', watch: 'Watch', alert: 'Alert' }

export function evaluate(ind, value) {
  if (value === null || value === undefined || value === '') return { status: 'none' }
  const n = Number(value)
  const dir = n < ind.normal[0] ? 'low' : 'high'
  if (n >= ind.normal[0] && n <= ind.normal[1]) return { status: 'good' }
  if (n >= ind.caution[0] && n <= ind.caution[1]) return { status: 'watch', dir }
  return { status: 'alert', dir }
}

const ORDER = ['none', 'good', 'watch', 'alert']
export const worst = (list) => list.reduce((a, b) => (ORDER.indexOf(b) > ORDER.indexOf(a) ? b : a), 'none')

export const MOOD_LABELS = { 1: 'Very low', 2: 'Low', 3: 'Okay', 4: 'Good', 5: 'Great' }
export const moodText = (v) => MOOD_LABELS[Math.min(5, Math.max(1, Math.round(v)))]