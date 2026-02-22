import React, { useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import TrendCard from '../components/TrendCard';

const categories = [
  { id: 'all',      label: 'Alle Kategorien' },
  { id: 'hashtag',  label: 'Hashtags' },
  { id: 'sound',    label: 'Sounds' },
  { id: 'topic',    label: 'Themen' },
];

const trends = [
  { type: 'hashtag', name: '#FYP',           score: 98, change: 15  },
  { type: 'hashtag', name: '#BeautyTips',    score: 91, change: 8   },
  { type: 'sound',   name: 'Flowers – Miley', score: 87, change: -3  },
  { type: 'topic',   name: 'Skincare Routine',score: 85, change: 22  },
  { type: 'hashtag', name: '#AestheticVibes', score: 82, change: 5   },
  { type: 'sound',   name: 'Espresso – Sabrina', score: 79, change: 31 },
  { type: 'topic',   name: 'GRWM (Get Ready With Me)', score: 77, change: 10 },
  { type: 'hashtag', name: '#MorningRoutine', score: 74, change: -1  },
];

export default function TrendRadar() {
  const [selected, setSelected] = useState(categories[0]);

  const filtered = selected.id === 'all'
    ? trends
    : trends.filter((t) => t.type === selected.id);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold gradient-text">TrendRadar</h2>
          <p className="text-sm text-gray-500 mt-0.5">Aktuelle Trends auf TikTok</p>
        </div>

        {/* Category filter – Headless UI Listbox (dropdown) */}
        <Listbox value={selected} onChange={setSelected}>
          <div className="relative w-full sm:w-52">
            <Listbox.Button className="relative w-full cursor-default rounded-xl bg-white border border-brand-200 py-2.5 pl-4 pr-10 text-left text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 shadow-sm">
              <span className="block truncate text-gray-700">{selected.label}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ChevronUpDownIcon className="h-4 w-4 text-brand-400" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 w-full bg-white rounded-2xl shadow-glass border border-brand-100 py-1 focus:outline-none">
                {categories.map((cat) => (
                  <Listbox.Option
                    key={cat.id}
                    value={cat}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2.5 pl-10 pr-4 text-sm ${
                        active ? 'bg-brand-50 text-brand-700' : 'text-gray-700'
                      }`
                    }
                  >
                    {({ selected: isSelected }) => (
                      <>
                        <span className={`block truncate ${isSelected ? 'font-semibold' : 'font-normal'}`}>
                          {cat.label}
                        </span>
                        {isSelected && (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-brand-600">
                            <CheckIcon className="h-4 w-4" aria-hidden="true" />
                          </span>
                        )}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>

      {/* Trend list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((t) => (
          <TrendCard key={t.name} {...t} />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-center text-gray-400 py-8">Keine Trends gefunden.</p>
        )}
      </div>
    </div>
  );
}
