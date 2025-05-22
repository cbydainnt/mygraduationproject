import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Navbar,
  Nav,
  NavDropdown,
  Container,
  Badge,
  Form,
  FormControl,
  Button,
  Row,
  Col,
  Spinner,
} from 'react-bootstrap';
import {
  Cart4,
  PersonCircle,
  BoxArrowRight,
  Wrench,
  Search,
  Heart,
} from 'react-bootstrap-icons';
import '../../styles/header.css';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { getAllCategories } from '../../services/categoryService';
import x from '../../assets/images/x.png';
import y1 from '../../assets/images/lgg.png';

const navLinkBaseClass = 'nav-link position-relative site-nav-link';
const categoryLinkClassName =
  'd-block p-1 text-truncate text-decoration-none category-menu-link';
const iconNavLinkClass = 'nav-link d-inline-flex align-items-center p-2 site-icon-link';

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const distinctItemCount = useCartStore((s) => s.getDistinctItemCount());
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [isCategoryMenuVisible, setIsCategoryMenuVisible] = useState(false);
  const categoryTimeoutRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const resp = await getAllCategories();
        setCategories(resp.data || []);
      } catch {
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?name=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  const getNavLinkClass = ({ isActive }) =>
    `${navLinkBaseClass} ${isActive ? 'active' : ''}`;

  const handleCategoryMouseEnter = () => {
    clearTimeout(categoryTimeoutRef.current);
    setIsCategoryMenuVisible(true);
  };

  const handleCategoryMouseLeave = () => {
    categoryTimeoutRef.current = setTimeout(() => {
      setIsCategoryMenuVisible(false);
    }, 200);
  };

  const megaMenuStyle = {
    minWidth: '600px',
    maxWidth: '800px',
    position: 'absolute',
    top: '100%',
    left: '-50px',
    zIndex: 1050,
    display: isCategoryMenuVisible ? 'block' : 'none',
    backgroundColor: '#fff',
    border: '1px solid #eee',
    borderRadius: '.375rem',
    boxShadow: '0 .5rem 1rem rgba(0,0,0,.1)',
  };

  return (
    <>
      <Navbar bg="white" variant="light" expand="lg" sticky="top" className="site-header border-bottom mb-3">
        <Container>
          {/* Logo */}
          <Navbar.Brand
            as={Link}
            to="/"
            className="fw-bolder me-4"
            style={{ fontSize: '1.5rem', color: '#333' }}
          >
            <img
              src={x}
              alt="Logo"
              style={{ height: '50px', objectFit: 'contain' }}
              className="me-2"
            />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto align-items-center main-nav">
              <NavLink to="/" className={getNavLinkClass} end>
                TRANG CHỦ
              </NavLink>

              <NavLink to="/categories" className={getNavLinkClass}>
                DANH MỤC
              </NavLink>

              <NavLink to="/products" className={getNavLinkClass}>
                SẢN PHẨM
              </NavLink>
              <NavLink to="/contact" className={getNavLinkClass}>
                LIÊN HỆ
              </NavLink>
            </Nav>

            <Form
              className="d-none d-lg-flex ms-auto me-2 search-form"
              style={{ width: '250px' }}
              onSubmit={handleSearchSubmit}
            >
              <FormControl
                type="search"
                placeholder="Tìm kiếm..."
                className="form-control-sm search-input"
                aria-label="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="outline-secondary" type="submit" size="sm" className="ms-1">
                <Search />
              </Button>
            </Form>

            <Nav className="align-items-center right-nav">
              <Nav.Link href="#search-mobile" className="d-lg-none p-2 site-icon-link">
                <Search size={18} />
              </Nav.Link>

              {isAuthenticated && (
                <Nav.Link
                  as={Link}
                  to="/favorites"
                  className={iconNavLinkClass}
                  title="Sản phẩm yêu thích của tôi"
                >
                  <Heart size={18} />
                </Nav.Link>
              )}

              <Nav.Link
                as={Link}
                to="/cart"
                className={`${iconNavLinkClass} position-relative`}
                title="Giỏ hàng"
              >
                <Cart4 size={20} />
                {distinctItemCount > 0 && (
                  <Badge
                    pill
                    bg="danger"
                    className="position-absolute top-0 start-100 translate-middle"
                    style={{ fontSize: '0.6em', padding: '0.3em 0.5em' }}
                  >
                    {distinctItemCount > 9 ? '9+' : distinctItemCount}
                  </Badge>
                )}
              </Nav.Link>

              {isAuthenticated ? (
                <NavDropdown
                  title={<PersonCircle size={24} />}
                  id="user-nav-dropdown"
                  align="end"
                  className="user-dropdown"
                >
                  <NavDropdown.Header className="small text-muted">
                    Đã đăng nhập với tư cách<br />
                    <strong>{user?.firstName + " " + user?.lastName}</strong>
                  </NavDropdown.Header>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/profile">
                    Hồ sơ của tôi
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/orders">
                    Đơn hàng của tôi
                  </NavDropdown.Item>
                  {(user?.role === 'ADMIN' || user?.role === 'STAFF') && (
                    <>
                      <NavDropdown.Divider />
                      <NavDropdown.Item as={Link} to="/admin/dashboard">
                        <Wrench size={16} className="me-1" /> Admin Panel
                      </NavDropdown.Item>
                    </>
                  )}
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logout} className="text-danger">
                    <BoxArrowRight size={16} className="me-1" /> Đăng xuất
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link as={Link} to="/login" className={iconNavLinkClass}>
                  <PersonCircle size={24} />
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
