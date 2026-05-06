import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { generate } from '../api';
import './RandomGeneratePage.css';

const CHARACTERS = [
  { id: 'girl', label: '小女孩', emoji: '👧' },
  { id: 'boy', label: '小男孩', emoji: '👦' },
  { id: 'bear', label: '小熊', emoji: '🐻' },
  { id: 'bunny', label: '小兔', emoji: '🐰' },
  { id: 'puppy', label: '小狗', emoji: '🐶' },
  { id: 'kitten', label: '小猫', emoji: '🐱' },
  { id: 'robot', label: '机器人', emoji: '🤖' },
  { id: 'pony', label: '小马', emoji: '🦄' },
  { id: 'unicorn', label: '独角兽', emoji: '🦄' },
  { id: 'fox', label: '小狐狸', emoji: '🦊' },
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
  { id: 'desert', label: '沙漠', emoji: '🏜️' },
  { id: 'arctic', label: '北极', emoji: '❄️' },
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
  { id: 'environmental', label: '环保', emoji: '🌍' },
  { id: 'sharing', label: '分享', emoji: '🎁' },
];

const STYLES = [
  { id: 'comic', label: '漫画', emoji: '💥' },
  { id: 'vibrant', label: '元气', emoji: '✨' },
  { id: 'medieval', label: '中世纪', emoji: '🗡️' },
  { id: 'watercolor', label: '水彩', emoji: '🎨' },
];

const STYLE_MAP = {
  comic: 'comic',
  vibrant: 'vibrant',
  medieval: 'medieval',
  watercolor: 'watercolor',
};

const RandomGeneratePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    character: '',
    setting: '',
    theme: '',
    style: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleSelect = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleRandomize = () => {
    const randomCharacter = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
    const randomSetting = SETTINGS[Math.floor(Math.random() * SETTINGS.length)];
    const randomTheme = THEMES[Math.floor(Math.random() * THEMES.length)];
    const randomStyle = STYLES[Math.floor(Math.random() * STYLES.length)];

    setFormData({
      character: randomCharacter.id,
      setting: randomSetting.id,
      theme: randomTheme.id,
      style: randomStyle.id,
    });
    setError('');
  };

  const handleGenerate = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    const { character, setting, theme, style } = formData;

    if (!character || !setting || !theme || !style) {
      setError('请选择所有选项');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const result = await generate.random({ character, setting, theme, style });
      navigate(`/preview/${result.id}`);
    } catch (err) {
      setError(err.message || '生成失败，请稍后重试');
      setIsGenerating(false);
    }
  };

  const canGenerate = () => {
    return formData.character && formData.setting && formData.theme && formData.style;
  };

  const renderOptionCard = (option, field) => (
    <button
      key={option.id}
      className={`option-card ${formData[field] === option.id ? 'selected' : ''}`}
      onClick={() => handleSelect(field, option.id)}
      type="button"
    >
      <span className="option-emoji">{option.emoji}</span>
      <span className="option-label">{option.label}</span>
    </button>
  );

  return (
    <div className="random-generate-page">
      <div className="random-generate-container">
        <div className="random-generate-header">
          <h1 className="random-generate-title">随机生成绘本</h1>
          <p className="random-generate-subtitle">选择你的故事元素，或让命运来决定</p>
          <button
            className="random-btn"
            onClick={handleRandomize}
            type="button"
            disabled={isGenerating}
          >
            <span className="random-btn-icon">🎲</span>
            随机选择
          </button>
        </div>

        <div className="selection-sections">
          <div className="selection-section">
            <h3 className="section-title">
              <span className="section-icon">🦸</span>
              主角
            </h3>
            <div className="options-grid options-grid-5">
              {CHARACTERS.map((option) => renderOptionCard(option, 'character'))}
            </div>
          </div>

          <div className="selection-section">
            <h3 className="section-title">
              <span className="section-icon">🏞️</span>
              场景
            </h3>
            <div className="options-grid options-grid-5">
              {SETTINGS.map((option) => renderOptionCard(option, 'setting'))}
            </div>
          </div>

          <div className="selection-section">
            <h3 className="section-title">
              <span className="section-icon">💡</span>
              主题
            </h3>
            <div className="options-grid options-grid-5">
              {THEMES.map((option) => renderOptionCard(option, 'theme'))}
            </div>
          </div>

          <div className="selection-section">
            <h3 className="section-title">
              <span className="section-icon">🎨</span>
              画风
            </h3>
            <div className="options-grid options-grid-4">
              {STYLES.map((option) => renderOptionCard(option, 'style'))}
            </div>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="generate-actions">
          <button
            className="btn btn-generate"
            onClick={handleGenerate}
            type="button"
            disabled={!canGenerate() || isGenerating}
          >
            {isGenerating ? '生成中...' : '开始生成'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RandomGeneratePage;