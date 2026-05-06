import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { generate } from '../api';
import './ChatGeneratePage.css';

const CHARACTERS = [
  { id: 'girl', label: '小女孩', emoji: '👧' },
  { id: 'boy', label: '小男孩', emoji: '👦' },
  { id: 'bear', label: '小熊', emoji: '🐻' },
  { id: 'bunny', label: '小兔', emoji: '🐰' },
  { id: 'puppy', label: '小狗', emoji: '🐶' },
  { id: 'kitten', label: '小猫', emoji: '🐱' },
  { id: 'robot', label: '机器人', emoji: '🤖' },
  { id: 'pony', label: '小马', emoji: '🦄' },
];

const SETTINGS = [
  { id: 'forest', label: '森林', emoji: '🌲' },
  { id: 'ocean', label: '海底', emoji: '🌊' },
  { id: 'space', label: '太空', emoji: '🚀' },
  { id: 'city', label: '城市', emoji: '🏙️' },
  { id: 'farm', label: '农场', emoji: '🌾' },
  { id: 'school', label: '学校', emoji: '🏫' },
  { id: 'castle', label: '城堡', emoji: '🏰' },
  { id: 'jungle', label: '丛林', emoji: '🌴' },
];

const THEMES = [
  { id: 'adventure', label: '冒险', emoji: '⚔️' },
  { id: 'friendship', label: '友情', emoji: '🤝' },
  { id: 'growth', label: '成长', emoji: '🌱' },
  { id: 'humor', label: '幽默', emoji: '😂' },
  { id: 'courage', label: '勇气', emoji: '💪' },
  { id: 'family', label: '亲情', emoji: '❤️' },
  { id: 'wisdom', label: '智慧', emoji: '🧠' },
  { id: 'gratitude', label: '感恩', emoji: '🙏' },
];

const STYLE_MAP = {
  comic: 'comic',
  vibrant: 'vibrant',
  medieval: 'medieval',
  watercolor: 'watercolor',
};

const STYLES = [
  { id: 'comic', label: '漫画', emoji: '💥' },
  { id: 'vibrant', label: '元气', emoji: '✨' },
  { id: 'medieval', label: '中世纪', emoji: '🗡️' },
  { id: 'watercolor', label: '水彩', emoji: '🎨' },
];

const STEPS = ['character', 'setting', 'theme', 'style', 'description'];

const ChatGeneratePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    character: '',
    setting: '',
    theme: '',
    style: '',
    description: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const step = STEPS[currentStep];

  const handleSelect = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleNext = () => {
    const requiredFields = ['character', 'setting', 'theme', 'style'];
    const field = requiredFields[currentStep];

    if (currentStep < 4 && !formData[field]) {
      setError(`请选择${getFieldLabel(field)}`);
      return;
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleGenerate = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    const { character, setting, theme, style, description } = formData;

    const charLabel = CHARACTERS.find((c) => c.id === character)?.label || character;
    const setLabel = SETTINGS.find((s) => s.id === setting)?.label || setting;
    const themeLabel = THEMES.find((t) => t.id === theme)?.label || theme;

    const fullDescription = `${charLabel}在${setLabel}展开了一段关于${themeLabel}的故事${description ? '。' + description : ''}`;

    setIsGenerating(true);
    setError('');

    try {
      const result = await generate.chat(
        { description: fullDescription, style: STYLE_MAP[formData.style] || 'watercolor' },
        user.token
      );
      navigate(`/preview/${result.id}`);
    } catch (err) {
      setError(err.message || '生成失败，请稍后重试');
      setIsGenerating(false);
    }
  };

  const getFieldLabel = (field) => {
    const labels = {
      character: '主角',
      setting: '场景',
      theme: '主题',
      style: '画风',
    };
    return labels[field] || field;
  };

  const getOptions = () => {
    switch (step) {
      case 'character':
        return CHARACTERS;
      case 'setting':
        return SETTINGS;
      case 'theme':
        return THEMES;
      case 'style':
        return STYLES;
      default:
        return [];
    }
  };

  const getCurrentField = () => {
    if (step === 'description') return 'description';
    const fieldMap = {
      character: 'character',
      setting: 'setting',
      theme: 'theme',
      style: 'style',
    };
    return fieldMap[step];
  };

  const renderStepIndicator = () => (
    <div className="step-indicator">
      {STEPS.map((s, index) => (
        <div
          key={s}
          className={`step-dot ${index <= currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
        >
          {index < currentStep ? '✓' : index + 1}
        </div>
      ))}
    </div>
  );

  const renderStepTitle = () => {
    const titles = {
      character: '选择故事主角',
      setting: '选择故事场景',
      theme: '选择故事主题',
      style: '选择画风',
      description: '补充故事描述（可选）',
    };
    return titles[step];
  };

  const renderOptions = () => {
    if (step === 'description') {
      return (
        <div className="description-section">
          <textarea
            className="description-input"
            placeholder="描述你想要的故事情节，例如：主角遇到困难并克服它，最终学会了勇敢..."
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            rows={5}
          />
        </div>
      );
    }

    const options = getOptions();
    const field = getCurrentField();

    return (
      <div className="options-grid">
        {options.map((option) => (
          <button
            key={option.id}
            className={`option-card ${formData[field] === option.id ? 'selected' : ''}`}
            onClick={() => handleSelect(field, option.id)}
            type="button"
          >
            <span className="option-emoji">{option.emoji}</span>
            <span className="option-label">{option.label}</span>
          </button>
        ))}
      </div>
    );
  };

  const canGoNext = () => {
    if (step === 'description') return true;
    const fieldMap = { character: 'character', setting: 'setting', theme: 'theme', style: 'style' };
    return !!formData[fieldMap[step]];
  };

  return (
    <div className="chat-generate-page">
      <div className="chat-generate-container">
        <div className="chat-generate-header">
          <h1 className="chat-generate-title">对话生成绘本</h1>
          <p className="chat-generate-subtitle">通过几步简单的选择，创造属于你的独特故事</p>
        </div>

        {renderStepIndicator()}

        <div className="step-content">
          <h2 className="step-title">{renderStepTitle()}</h2>

          {error && <div className="error-message">{error}</div>}

          {renderOptions()}

          <div className="step-actions">
            {currentStep > 0 && (
              <button
                className="btn btn-back"
                onClick={handleBack}
                type="button"
                disabled={isGenerating}
              >
                上一步
              </button>
            )}

            {currentStep < STEPS.length - 1 ? (
              <button
                className="btn btn-next"
                onClick={handleNext}
                type="button"
                disabled={!canGoNext()}
              >
                下一步
              </button>
            ) : (
              <button
                className="btn btn-generate"
                onClick={handleGenerate}
                type="button"
                disabled={isGenerating}
              >
                {isGenerating ? '生成中...' : '开始生成'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatGeneratePage;