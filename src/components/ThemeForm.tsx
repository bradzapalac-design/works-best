import { useState, type FormEvent } from "react";
import { THEME_COLORS, THEME_ICONS, type Theme, type ThemeIcon } from "../types";
import { Icon } from "./Icons";
import { Modal } from "./Modal";

interface ThemeFormProps {
  initial?: Theme;
  onClose: () => void;
  onSave: (input: {
    name: string;
    description: string;
    color: string;
    icon: ThemeIcon;
  }) => void;
}

export function ThemeForm({ initial, onClose, onSave }: ThemeFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [color, setColor] = useState(initial?.color ?? THEME_COLORS[0]);
  const [icon, setIcon] = useState<ThemeIcon>(initial?.icon ?? "compass");

  function submit(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave({
      name: trimmed,
      description: description.trim(),
      color,
      icon,
    });
  }

  return (
    <Modal title={initial ? "Edit theme" : "New theme"} onClose={onClose}>
      <form className="form" onSubmit={submit}>
        <label>
          Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="A north star that lasts"
          />
        </label>
        <label>
          Short description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="What this area of life is for"
          />
        </label>
        <fieldset>
          <legend>Color</legend>
          <div className="swatches">
            {THEME_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                className={`swatch ${color === c ? "is-on" : ""}`}
                style={{ background: c }}
                onClick={() => setColor(c)}
                aria-label={c}
                aria-pressed={color === c}
              />
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>Icon</legend>
          <div className="icon-picks">
            {THEME_ICONS.map((iconName) => (
              <button
                key={iconName}
                type="button"
                className={`icon-pick ${icon === iconName ? "is-on" : ""}`}
                onClick={() => setIcon(iconName)}
                aria-label={iconName}
                aria-pressed={icon === iconName}
              >
                <Icon name={iconName} />
              </button>
            ))}
          </div>
        </fieldset>
        <div className="form-actions">
          <span />
          <div className="form-actions-right">
            <button type="button" className="btn ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              Save
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
